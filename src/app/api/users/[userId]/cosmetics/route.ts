import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';

// GET /api/users/[userId]/cosmetics - Get user's cosmetics
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const userCosmetics = await prisma.userCosmetic.findMany({
      where: { userId },
      include: {
        cosmetic: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json({ cosmetics: userCosmetics });
  } catch (error) {
    console.error('Error fetching user cosmetics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user cosmetics' },
      { status: 500 }
    );
  }
}