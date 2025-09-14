
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch trending posts (posts with most likes/comments in last 7 days)
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
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
      orderBy: [
        {
          likes: {
            _count: 'desc',
          },
        },
        {
          comments: {
            _count: 'desc',
          },
        },
      ],
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
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
