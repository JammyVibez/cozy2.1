import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';

// GET /api/cosmetics - Fetch all cosmetics with user's applied status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const whereClause = type ? { type: type as any } : category ? { type: category as any } : {};

    const cosmetics = await prisma.cosmetic.findMany({
      where: whereClause,
      include: {
        userCosmetics: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { isActive: true }
            }
          : false
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data to include applied status
    const cosmeticsWithStatus = cosmetics.map(cosmetic => ({
      ...cosmetic,
      isApplied: session?.user?.id 
        ? cosmetic.userCosmetics.length > 0 
        : false,
      isActive: session?.user?.id 
        ? cosmetic.userCosmetics.some(uc => uc.isActive)
        : false,
      userCosmetics: undefined // Remove from response
    }));

    return NextResponse.json({ cosmetics: cosmeticsWithStatus });
  } catch (error) {
    console.error('Error fetching cosmetics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cosmetics' },
      { status: 500 }
    );
  }
}