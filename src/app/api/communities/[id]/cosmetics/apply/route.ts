import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// POST /api/communities/[id]/cosmetics/apply - Apply or remove cosmetic to/from community
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: communityId } = params;
    const body = await request.json();
    const { cosmeticId, isActive } = body;

    if (!cosmeticId) {
      return NextResponse.json({ error: 'Cosmetic ID is required' }, { status: 400 });
    }

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

    // Check if cosmetic exists
    const cosmetic = await prisma.cosmetic.findUnique({
      where: { id: cosmeticId }
    });

    if (!cosmetic) {
      return NextResponse.json({ error: 'Cosmetic not found' }, { status: 404 });
    }

    if (isActive) {
      // Apply cosmetic to community
      const existingCommunityCosmetic = await prisma.communityCosmetic.findUnique({
        where: {
          communityId_cosmeticId: {
            communityId,
            cosmeticId
          }
        }
      });

      if (existingCommunityCosmetic) {
        // Update existing record
        await prisma.communityCosmetic.update({
          where: { id: existingCommunityCosmetic.id },
          data: { isActive: true }
        });
      } else {
        // Create new record
        await prisma.communityCosmetic.create({
          data: {
            communityId,
            cosmeticId,
            isActive: true
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Cosmetic applied to community successfully'
      });
    } else {
      // Remove cosmetic from community
      const existingCommunityCosmetic = await prisma.communityCosmetic.findUnique({
        where: {
          communityId_cosmeticId: {
            communityId,
            cosmeticId
          }
        }
      });

      if (existingCommunityCosmetic) {
        await prisma.communityCosmetic.update({
          where: { id: existingCommunityCosmetic.id },
          data: { isActive: false }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Cosmetic removed from community successfully'
      });
    }
  } catch (error) {
    console.error('Error applying community cosmetic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}