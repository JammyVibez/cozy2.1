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
    const { type = 'PREMIUM', expiresIn } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { premiumBadge: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }

    // Create or update premium badge
    let premiumBadge;
    if (user.premiumBadge) {
      premiumBadge = await prisma.premiumBadge.update({
        where: { userId },
        data: {
          type,
          expiresAt,
          purchasedAt: new Date()
        }
      });
    } else {
      premiumBadge = await prisma.premiumBadge.create({
        data: {
          userId,
          type,
          expiresAt,
          purchasedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      premiumBadge,
      message: `Premium badge ${type} assigned successfully`
    });

  } catch (error) {
    console.error('Error assigning premium badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { premiumBadge: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.premiumBadge) {
      return NextResponse.json({ error: 'User does not have a premium badge' }, { status: 400 });
    }

    // Remove premium badge
    await prisma.premiumBadge.delete({
      where: { userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Premium badge removed successfully'
    });

  } catch (error) {
    console.error('Error removing premium badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
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

    // Check admin privileges
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true }
    });
    
    const isAdmin = adminUser?.role === 'ADMIN' || 
                   adminUser?.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { userId } = resolvedParams;
    const { badgeType = 'VERIFIED', expiresAt } = await request.json();

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update premium badge
    const premiumBadge = await prisma.premiumBadge.upsert({
      where: { userId },
      create: {
        userId,
        type: badgeType,
        isActive: true,
        grantedBy: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      update: {
        type: badgeType,
        isActive: true,
        grantedBy: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date()
      }
    });

    // Also update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    return NextResponse.json({
      success: true,
      premiumBadge,
      message: 'Premium badge assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning premium badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin privileges
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true }
    });
    
    const isAdmin = adminUser?.role === 'ADMIN' || 
                   adminUser?.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { userId } = resolvedParams;

    // Remove premium badge
    await prisma.premiumBadge.deleteMany({
      where: { userId }
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Premium badge removed successfully'
    });
  } catch (error) {
    console.error('Error removing premium badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
