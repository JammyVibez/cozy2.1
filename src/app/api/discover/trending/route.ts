import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from "@/auth"; // your NextAuth config wrapper

export async function GET(request: NextRequest) {
  try {
    const session = await auth(); // replaces getServerSession
    if (!session?.user?.id) {
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

// Create trending users API endpoint
export async function GET() {
  try {
    // Get trending users based on recent activity, followers, and engagement
    const trendingUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            post: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
              }
            }
          },
          {
            followers: {
              some: {}
            }
          }
        ]
      },
      include: {
        _count: {
          select: {
            followers: true,
            post: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            },
            postLikes: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        },
        premiumBadge: true
      },
      orderBy: [
        { followers: { _count: 'desc' } },
        { post: { _count: 'desc' } }
      ],
      take: 10
    });

    const formattedUsers = trendingUsers.map(user => ({
      id: user.id,
      username: user.username || `user_${user.id.slice(0, 8)}`,
      name: user.name || 'Anonymous User',
      profilePhoto: user.profilePhoto,
      followers: user._count.followers,
      isVerified: !!user.premiumBadge,
      recentPosts: user._count.post,
      recentLikes: user._count.postLikes
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching trending users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}