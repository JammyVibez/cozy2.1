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
        // For trending, we'll use a combination of recent activity and member count
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
            name: true,
            username: true,
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
          },
        },
      },
      take: 50, // Limit results
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
      isJoined: community.members.length > 0,
      creator: community.creator,
    }));

    return NextResponse.json(transformedCommunities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}