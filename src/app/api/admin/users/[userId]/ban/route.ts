
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURITY FIX: Check admin privileges using only role field or ADMIN_EMAIL
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true }
    });
    
    const isAdmin = adminUser?.role === 'ADMIN' || 
                   adminUser?.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId } = await params;
    const { reason } = await request.json();

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Ban reason is required' }, { status: 400 });
    }

    // Check if user exists and is not already banned
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        isBanned: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'User is already banned' }, { status: 400 });
    }

    // Don't allow banning other admins
    if (user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot ban admin users' }, { status: 403 });
    }

    // Ban the user
    const bannedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        banReason: reason.trim(),
        bannedAt: new Date(),
        bannedBy: session.user.id,
        isActive: false
      },
      select: {
        id: true,
        name: true,
        username: true,
        isBanned: true,
        banReason: true,
        bannedAt: true
      }
    });
    
    return NextResponse.json({
      success: true,
      user: bannedUser,
      message: `User ${user.username || user.name} has been banned successfully`
    });
  } catch (error) {
    console.error('Error banning user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
