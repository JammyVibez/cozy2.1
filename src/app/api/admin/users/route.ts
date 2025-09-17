
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'ALL';
    const status = searchParams.get('status') || 'ALL';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Apply role filter
    if (role !== 'ALL') {
      where.role = role;
    }

    // Apply status filter
    if (status === 'ACTIVE') {
      where.isActive = true;
      where.isBanned = false;
    } else if (status === 'BANNED') {
      where.isBanned = true;
    } else if (status === 'INACTIVE') {
      where.isActive = false;
    }

    // FIX: Use proper Prisma query without mixing select and include
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePhoto: true,
        role: true,
        isVerified: true,
        isActive: true,
        isBanned: true,
        banReason: true,
        bannedAt: true,
        suspendedUntil: true,
        lastLoginAt: true,
        emailVerified: true,
        _count: {
          select: {
            post: true,
            followers: true,
            following: true,
            communityMemberships: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isVerified: user.isVerified || !!user.emailVerified,
      isActive: user.isActive,
      isBanned: user.isBanned,
      role: user.role,
      banReason: user.banReason,
      bannedAt: user.bannedAt?.toISOString(),
      suspendedUntil: user.suspendedUntil?.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      stats: {
        posts: user._count.post,
        followers: user._count.followers,
        following: user._count.following,
        communities: user._count.communityMemberships
      }
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
