
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { integrationId, connect } = body;

    if (!integrationId || typeof connect !== 'boolean') {
      return NextResponse.json({ 
        error: 'Integration ID and connect status are required' 
      }, { status: 400 });
    }

    // For now, we'll just simulate the integration toggle
    // In a real implementation, you would handle OAuth flows and store tokens
    
    const integration = {
      id: integrationId,
      userId: session.user.id,
      isConnected: connect,
      connectedAt: connect ? new Date() : null
    };

    return NextResponse.json({
      success: true,
      integration
    });
  } catch (error) {
    console.error('Error toggling integration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
