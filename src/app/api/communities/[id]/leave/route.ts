import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const communityId = id;
  const userId = session.user.id;

  // Check if user is a member
  const membership = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
    include: {
      community: {
        select: {
          creatorId: true,
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ error: 'Not a member' }, { status: 400 });
  }

  // Prevent community creator from leaving
  if (membership.community.creatorId === userId) {
    return NextResponse.json({
      error: 'Community creators cannot leave their own community'
    }, { status: 400 });
  }

  // Remove user from community
  await prisma.communityMember.delete({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
  });

  return NextResponse.json({ success: true });
}

export { POST };