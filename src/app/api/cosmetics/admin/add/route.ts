import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const addCosmeticSchema = z.object({
  type: z.enum(['THEME', 'BANNER', 'NAMEPLATE', 'PFP_FRAME']),
  name: z.string().min(1),
  preview: z.string().url(),
  assetUrl: z.string().url(),
  assetType: z.enum(['html', 'gif', 'image', 'video', 'svg']).optional(),
  metadata: z.record(z.any()).optional()
});

// POST /api/cosmetics/admin/add - Add new cosmetic (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (you can implement role-based auth here)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { premiumBadge: true }
    });

    // For now, check if user has premium badge or implement proper admin role
    // TODO: Add proper admin role check
    if (!user || (!user.premiumBadge && user.email !== process.env.ADMIN_EMAIL)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = addCosmeticSchema.parse(body);

    // Create the cosmetic
    const cosmetic = await prisma.cosmetic.create({
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      cosmetic,
      message: 'Cosmetic added successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding cosmetic:', error);
    return NextResponse.json(
      { error: 'Failed to add cosmetic' },
      { status: 500 }
    );
  }
}