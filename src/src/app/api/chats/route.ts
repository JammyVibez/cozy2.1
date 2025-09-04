import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
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
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: session.user.id },
                read: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      participants: chat.participants,
      lastMessage: chat.messages[0] || null,
      unreadCount: chat._count.messages,
    }));

    return NextResponse.json({ chats: formattedChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { participantId } = await request.json();

    if (!participantId || participantId === session.user.id) {
      return NextResponse.json({ error: 'Invalid participant' }, { status: 400 });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { id: session.user.id },
            },
          },
          {
            participants: {
              some: { id: participantId },
            },
          },
        ],
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [{ id: session.user.id }, { id: participantId }],
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });

    return NextResponse.json({ chat: newChat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}