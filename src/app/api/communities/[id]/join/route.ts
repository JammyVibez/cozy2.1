import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// Original POST handler for joining a community
async function postJoin(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const communityId = params.id;
    const userId = session.user.id;

    // Check if community exists and is public
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    if (!community.isPublic) {
      return NextResponse.json({ error: 'Community is private' }, { status: 403 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 });
    }

    // Add user to community
    const membership = await prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: 'MEMBER',
      },
    });

    return NextResponse.json({
      success: true,
      membership: {
        id: membership.id,
        role: membership.role,
        joinedAt: membership.joinedAt,
      }
    });
  } catch (error) {
    console.error('Error joining community:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Updated POST handler to correctly handle Next.js 15 params types
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return postJoin(request, { params: { id } });
}