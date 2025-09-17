
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin privileges
    const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
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

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePhoto: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isVerified: false, // Add verification logic
      isActive: true, // Add active status logic
      isBanned: false, // Add ban status logic
      role: 'USER', // Add role logic
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      stats: {
        posts: user._count.posts,
        followers: user._count.followers,
        following: user._count.following,
        communities: 0 // Add community count
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
