import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// GET /api/communities/[id]/cosmetics - Fetch community cosmetics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: communityId } = await params;

    // Check if user is admin of the community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: communityId
        }
      }
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch community cosmetics
    const communityCosmetics = await prisma.communityCosmetic.findMany({
      where: { communityId },
      include: {
        cosmetic: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json({ cosmetics: communityCosmetics });
  } catch (error) {
    console.error('Error fetching community cosmetics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}