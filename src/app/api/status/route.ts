
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma/prisma';
import { authOptions } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, text, mood, activity, expiresIn } = await request.json();

    if (!type || !['text', 'mood', 'activity'].includes(type)) {
      return NextResponse.json({ error: 'Invalid status type' }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + (expiresIn || 24 * 60 * 60 * 1000));

    // Delete any existing active status for this user
    await prisma.userStatus.deleteMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() }
      }
    });

    // Create new status
    const status = await prisma.userStatus.create({
      data: {
        userId: session.user.id,
        type,
        text: text || null,
        mood: mood || null,
        activity: activity || null,
        expiresAt
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      }
    });

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error creating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active statuses from followed users and own status
    const statuses = await prisma.userStatus.findMany({
      where: {
        AND: [
          { expiresAt: { gt: new Date() } },
          {
            OR: [
              { userId: session.user.id },
              {
                user: {
                  followers: {
                    some: { followerId: session.user.id }
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ statuses });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user's active status
    await prisma.userStatus.deleteMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
