import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'trending';
    const active = searchParams.get('active') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause for filtering
    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (active) {
      where.posts = {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      };
    }

    // Build orderBy clause for sorting
    let orderBy: any;
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'members':
        orderBy = { members: { _count: 'desc' } };
        break;
      case 'trending':
      default:
        orderBy = [
          { updatedAt: 'desc' },
          { members: { _count: 'desc' } },
        ];
        break;
    }

    const communities = await prisma.community.findMany({
      where,
      orderBy,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
        members: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
      take: limit,
    });

    // Transform the data for the frontend
    const transformedCommunities = communities.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      category: community.category,
      theme: community.theme,
      avatar: community.avatar,
      banner: community.banner,
      isPublic: community.isPublic,
      memberCount: community._count.members,
      postCount: community._count.posts,
      onlineMembers: Math.floor(community._count.members * 0.1), // Mock online members
      isJoined: community.members.length > 0,
      isActive: community._count.posts > 0,
      creator: community.creator,
    }));

    // Return appropriate response based on query type
    if (active) {
      return NextResponse.json({ communities: transformedCommunities });
    }

    return NextResponse.json(transformedCommunities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}