import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const communityId = id;
    const userId = session.user.id;

    // Check if user is a member
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }

    const chatRooms = await prisma.communityChatRoom.findMany({
      where: {
        communityId,
        OR: [
          { isPublic: true },
          { 
            participants: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            messages: true,
            participants: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ chatRooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params here
    const communityId = id;
    const userId = session.user.id;

    // Check if user has permission to create chat rooms (admin/moderator)
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (!membership || !['ADMIN', 'MODERATOR'].includes(membership.role)) {
      return NextResponse.json({ 
        error: 'Only admins and moderators can create chat rooms' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Chat room name is required' 
      }, { status: 400 });
    }

    const chatRoom = await prisma.communityChatRoom.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic !== false,
        communityId,
      },
      include: {
        _count: {
          select: {
            messages: true,
            participants: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, chatRoom });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}