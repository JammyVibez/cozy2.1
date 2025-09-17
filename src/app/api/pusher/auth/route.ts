
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { pusher } from '@/lib/pusher/pusherServer';

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

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        username: session.user.username || session.user.email?.split('@')[0],
        avatar: session.user.image
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
