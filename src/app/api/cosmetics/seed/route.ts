import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';

// POST /api/cosmetics/seed - Create sample cosmetics for testing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (optional - you can remove this check for testing)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Sample cosmetics data
    const sampleCosmetics = [
      {
        type: 'PFP_FRAME',
        name: 'Sparkle Frame',
        preview: '/cosmetics/sample-pfp-frame.html',
        assetUrl: '/cosmetics/sample-pfp-frame.html',
        metadata: {
          position: 'center',
          size: 'full',
          zIndex: 5,
          opacity: 0.8
        }
      },
      {
        type: 'BANNER',
        name: 'Purple Gradient Banner',
        preview: '/cosmetics/sample-banner.html',
        assetUrl: '/cosmetics/sample-banner.html',
        metadata: {
          position: 'center',
          size: 'full',
          zIndex: 3,
          opacity: 0.6
        }
      },
      {
        type: 'PFP_FRAME',
        name: 'Golden Crown',
        preview: '/cosmetics/sample-pfp-frame.html',
        assetUrl: '/cosmetics/sample-pfp-frame.html',
        metadata: {
          position: 'top-center',
          size: 'large',
          zIndex: 10,
          opacity: 1
        }
      }
    ];

    // Create cosmetics
    const createdCosmetics = [];
    for (const cosmeticData of sampleCosmetics) {
      // Check if cosmetic already exists
      const existingCosmetic = await prisma.cosmetic.findFirst({
        where: {
          name: cosmeticData.name,
          type: cosmeticData.type
        }
      });

      if (existingCosmetic) {
        createdCosmetics.push(existingCosmetic);
        continue;
      }

      const cosmetic = await prisma.cosmetic.create({
        data: cosmeticData
      });
      createdCosmetics.push(cosmetic);
    }

    return NextResponse.json({
      success: true,
      message: 'Sample cosmetics created successfully',
      cosmetics: createdCosmetics
    });
  } catch (error) {
    console.error('Error seeding cosmetics:', error);
    return NextResponse.json(
      { error: 'Failed to seed cosmetics' },
      { status: 500 }
    );
  }
}
