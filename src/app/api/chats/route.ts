import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { id: session.user.id },
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
          orderBy: { createdAt: 'desc' },
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
                read: false,
                senderId: { not: session.user.id },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      participants: chat.participants.map(p => ({
        ...p,
        isOnline: Math.random() > 0.5, // Mock online status
        lastSeen: new Date().toISOString(),
      })),
      lastMessage: chat.messages[0] || null,
      unreadCount: chat._count.messages,
    }));

    return NextResponse.json({ chats: formattedChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    // This catch block also handles the case where the response is not valid JSON
    if (error instanceof Error && error.message.includes('Unexpected token <')) {
      return NextResponse.json({ error: 'Invalid response from server, likely an HTML error page.' }, { status: 500 });
    }
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
        participants: {
          every: { // Changed from 'some' to 'every' to ensure both participants are in the chat
            id: { in: [session.user.id, participantId] },
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
      },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [
            { id: session.user.id },
            { id: participantId },
          ],
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