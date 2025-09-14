
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'people';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    switch (type) {
      case 'people':
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: {
            _count: {
              select: {
                followers: true,
              },
            },
          },
          take: 20,
        });

        const formattedUsers = users.map(user => ({
          id: user.id,
          username: user.username,
          name: user.name,
          bio: user.bio,
          profilePhoto: user.profilePhoto,
          verified: user.verified,
          followers: user._count.followers,
          mutualFollows: 0,
        }));

        return NextResponse.json({ users: formattedUsers });

      case 'trending':
        const posts = await prisma.post.findMany({
          where: {
            content: { contains: query, mode: 'insensitive' },
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                profilePhoto: true,
                verified: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            likes: {
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        });

        const formattedPosts = posts.map(post => ({
          id: post.id,
          content: post.content,
          author: post.author,
          createdAt: post.createdAt,
          likes: post._count.likes,
          comments: post._count.comments,
          isLiked: post.likes.length > 0,
          visualMedia: post.visualMedia,
        }));

        return NextResponse.json({ posts: formattedPosts });

      case 'hashtags':
        const hashtagPosts = await prisma.post.findMany({
          where: {
            content: { contains: `#${query}`, mode: 'insensitive' },
          },
          select: {
            content: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          take: 100,
        });

        const hashtagData = {
          hashtag: query,
          posts: hashtagPosts.length,
          engagement: hashtagPosts.reduce((sum, post) =>
            sum + post._count.likes + post._count.comments, 0
          ),
        };

        return NextResponse.json({ hashtags: [hashtagData] });

      default:
        return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
