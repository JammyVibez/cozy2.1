import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher/pusherClient';

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, userName, isTyping } = await request.json();

    if (!postId || !userId || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Broadcast typing indicator to all users subscribed to this post
    await pusherServer.trigger(`post-${postId}`, 'user-typing', {
      userId,
      userName,
      isTyping,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending typing indicator:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}