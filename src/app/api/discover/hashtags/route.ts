
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get posts from last 7 days and extract hashtags
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
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
    });

    // Extract hashtags from post content
    const hashtagCounts: Record<string, { count: number; engagement: number }> = {};
    
    posts.forEach(post => {
      const hashtags = post.content.match(/#\w+/g) || [];
      const engagement = post._count.likes + post._count.comments;
      
      hashtags.forEach(hashtag => {
        const tag = hashtag.toLowerCase();
        if (!hashtagCounts[tag]) {
          hashtagCounts[tag] = { count: 0, engagement: 0 };
        }
        hashtagCounts[tag].count++;
        hashtagCounts[tag].engagement += engagement;
      });
    });

    // Sort by engagement and count
    const trendingHashtags = Object.entries(hashtagCounts)
      .map(([hashtag, data]) => ({
        hashtag: hashtag.substring(1), // Remove the # symbol
        posts: data.count,
        engagement: data.engagement,
      }))
      .sort((a, b) => b.engagement - a.engagement || b.posts - a.posts)
      .slice(0, 20);

    return NextResponse.json({ hashtags: trendingHashtags });
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
