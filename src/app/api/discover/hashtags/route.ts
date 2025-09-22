import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { auth } from "@/auth"; // NextAuth v5 instance

export async function GET(_request: NextRequest) {
  try {
    const session = await auth(); // replaces getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get posts from last 7 days
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      select: {
        content: true,
        _count: {
          select: {
            postLikes: true,
            comments: true,
          },
        },
      },
    });

    // Count hashtags
    const hashtagCounts: Record<string, { count: number; engagement: number }> =
      {};

    posts.forEach((post) => {
      const hashtags = post.content?.match(/#\w+/g) || [];
      const engagement = post._count.postLikes + post._count.comments;

      hashtags.forEach((hashtag) => {
        const tag = hashtag.toLowerCase();
        if (!hashtagCounts[tag]) {
          hashtagCounts[tag] = { count: 0, engagement: 0 };
        }
        hashtagCounts[tag].count++;
        hashtagCounts[tag].engagement += engagement;
      });
    });

    // Sort by engagement → fallback to count
    const trendingHashtags = Object.entries(hashtagCounts)
      .map(([hashtag, data]) => ({
        hashtag: hashtag.substring(1), // remove the "#"
        posts: data.count,
        engagement: data.engagement,
      }))
      .sort((a, b) => b.engagement - a.engagement || b.posts - a.posts)
      .slice(0, 20);

    return NextResponse.json({ hashtags: trendingHashtags });
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
