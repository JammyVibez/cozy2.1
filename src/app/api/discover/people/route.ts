
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from "@/auth"; // your NextAuth config wrapper

export async function GET(request: NextRequest) {
  try {
    const session = await auth(); // replaces getServerSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get users that the current user is not following
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.id },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const suggestedUsers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUser.id } },
          {
            followers: {
              none: {
                followerId: currentUser.id,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
      take: 20,
    });

    const formattedUsers = suggestedUsers.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      verified: user.verified,
      followers: user._count.followers,
      mutualFollows: 0, // TODO: Calculate mutual follows
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
