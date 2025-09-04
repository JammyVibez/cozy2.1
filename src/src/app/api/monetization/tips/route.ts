import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, amount, message, postId } = body;
    
    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Receiver ID and valid amount are required' 
      }, { status: 400 });
    }

    if (receiverId === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot tip yourself' 
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Check sender has enough Cozy Coins
    // 2. Deduct coins from sender
    // 3. Add coins to receiver
    // 4. Create tip record
    // 5. Send notification

    // For now, return success response
    return NextResponse.json({ 
      success: true, 
      message: `Sent ${amount} Cozy Coins tip`,
      tip: {
        amount,
        message,
        receiverId,
        postId
      }
    });
  } catch (error) {
    console.error('Error sending tip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'sent' or 'received'

    // In a real implementation, fetch tips from database
    // For now, return mock data
    return NextResponse.json({
      tips: [],
      totalEarned: 0,
      totalSent: 0,
      cozyCoins: 100, // User's current balance
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}