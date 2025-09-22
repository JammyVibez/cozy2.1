
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { pusher } from '@/lib/pusher/pusherServer';
import prisma from '@/lib/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { socket_id, channel_name } = await request.json();

    // Validate channel access
    if (channel_name.startsWith('private-') || channel_name.startsWith('presence-')) {
      // Add channel-specific authorization logic here
      // For now, allow all authenticated users
    }

    // Fetch user data from database to get username
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, name: true, email: true, image: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: user.name,
        username: user.username || user.email?.split('@')[0],
        avatar: user.image
      }
    };

    if (channel_name.startsWith('presence-')) {
      const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData);
      return NextResponse.json(authResponse);
    } else {
      const authResponse = pusher.authorizeChannel(socket_id, channel_name);
      return NextResponse.json(authResponse);
    }
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
