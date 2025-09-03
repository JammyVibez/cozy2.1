import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { toGetPost } from '@/lib/prisma/toGetPost';

// Assuming GET and POST are in separate files named GET.ts and POST.ts in the same directory
// This file acts as an entry point and handles the promise resolution for params.

async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const communityId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = parseInt(searchParams.get('cursor') || '0');
    const zoneId = searchParams.get('zoneId');

    // Check if user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }

    const where: any = {
      communityPost: {
        communityId,
        ...(zoneId && { zoneId }),
      },
    };

    const posts = await prisma.post.findMany({
      where,
      select: selectPost(session.user.id),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: cursor,
    });

    const formattedPosts = await Promise.all(
      posts.map(post => toGetPost(post))
    );

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const communityId = resolvedParams.id;
    const userId = session.user.id;

    // Check if user is a member with posting permissions
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }

    const body = await request.json();
    const { content, zoneId, visualMediaUrls } = body;

    if (!content && (!visualMediaUrls || visualMediaUrls.length === 0)) {
      return NextResponse.json({
        error: 'Post must have content or media'
      }, { status: 400 });
    }

    // Validate zone belongs to community (if specified)
    if (zoneId) {
      const zone = await prisma.communityZone.findFirst({
        where: {
          id: zoneId,
          communityId,
        },
      });

      if (!zone || !zone.permissions.includes('POST')) {
        return NextResponse.json({
          error: 'Invalid zone or no posting permissions'
        }, { status: 400 });
      }
    }

    // Create the regular post first
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        visualMedia: visualMediaUrls ? {
          createMany: {
            data: visualMediaUrls.map((url: string, index: number) => ({
              fileName: url,
              type: url.includes('video') ? 'VIDEO' : 'IMAGE',
              order: index,
              userId,
            })),
          },
        } : undefined,
      },
      select: selectPost(userId),
    });

    // Link to community
    await prisma.communityPost.create({
      data: {
        postId: post.id,
        communityId,
        zoneId: zoneId || null,
      },
    });

    const formattedPost = await toGetPost(post);
    return NextResponse.json({ success: true, post: formattedPost });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}