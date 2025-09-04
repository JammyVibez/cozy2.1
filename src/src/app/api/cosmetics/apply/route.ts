import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const applySchema = z.object({
  cosmeticId: z.string(),
  isActive: z.boolean().optional().default(true)
});

// POST /api/cosmetics/apply - Apply/unapply a cosmetic for a user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cosmeticId, isActive } = applySchema.parse(body);

    // Check if cosmetic exists
    const cosmetic = await prisma.cosmetic.findUnique({
      where: { id: cosmeticId }
    });

    if (!cosmetic) {
      return NextResponse.json(
        { error: 'Cosmetic not found' },
        { status: 404 }
      );
    }

    // If applying the cosmetic, deactivate other cosmetics of the same type
    if (isActive) {
      await prisma.userCosmetic.updateMany({
        where: {
          userId: session.user.id,
          cosmetic: { type: cosmetic.type }
        },
        data: { isActive: false }
      });
    }

    // Upsert the user cosmetic
    const userCosmetic = await prisma.userCosmetic.upsert({
      where: {
        userId_cosmeticId: {
          userId: session.user.id,
          cosmeticId: cosmeticId
        }
      },
      update: { isActive },
      create: {
        userId: session.user.id,
        cosmeticId: cosmeticId,
        isActive
      },
      include: {
        cosmetic: true
      }
    });

    return NextResponse.json({
      success: true,
      userCosmetic,
      message: isActive ? 'Cosmetic applied successfully' : 'Cosmetic removed successfully'
    });
  } catch (error) {
    console.error('Error applying cosmetic:', error);
    return NextResponse.json(
      { error: 'Failed to apply cosmetic' },
      { status: 500 }
    );
  }
}