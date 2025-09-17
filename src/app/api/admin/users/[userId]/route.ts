
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function PATCH(
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
    const updates = await request.json();

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (typeof updates.isVerified === 'boolean') {
      updateData.isVerified = updates.isVerified;
    }
    
    if (typeof updates.isActive === 'boolean') {
      updateData.isActive = updates.isActive;
    }
    
    if (typeof updates.isBanned === 'boolean') {
      updateData.isBanned = updates.isBanned;
      if (updates.isBanned) {
        updateData.bannedAt = new Date();
        updateData.bannedBy = session.user.id;
        updateData.isActive = false;
      } else {
        updateData.bannedAt = null;
        updateData.bannedBy = null;
        updateData.banReason = null;
        updateData.isActive = true;
      }
    }
    
    if (updates.role && ['USER', 'MODERATOR', 'ADMIN'].includes(updates.role)) {
      updateData.role = updates.role;
    }
    
    if (updates.suspendedUntil) {
      updateData.suspendedUntil = new Date(updates.suspendedUntil);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        isBanned: true,
        banReason: true,
        bannedAt: true,
        suspendedUntil: true
      }
    });
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
