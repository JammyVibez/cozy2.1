import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const communityId = id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: any = { communityId };

    if (type && type !== 'ALL') {
      where.type = type;
    }

    if (upcoming) {
      where.startTime = {
        gte: new Date(),
      };
    }

    const events = await prisma.communityEvent.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const communityId = id;
    const userId = session.user.id;

    // Check if user is a member with permission to create events
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
        error: 'Only admins and moderators can create events'
      }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, eventType, startTime, endTime, location, maxAttendees } = body;

    if (!title || !eventType || !startTime) {
      return NextResponse.json({
        error: 'Title, event type, and start time are required'
      }, { status: 400 });
    }

    const event = await prisma.communityEvent.create({
      data: {
        title,
        description,
        eventType,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        maxAttendees,
        communityId,
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { GET, POST };