import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// POST - Purchase a text design template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Check if template exists and get its price
    const template = await prisma.textDesignTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template || !template.isActive) {
      return NextResponse.json({ error: 'Template not found or inactive' }, { status: 404 });
    }

    // Check if user already owns this template
    const existingPurchase = await prisma.userTextDesignTemplate.findUnique({
      where: {
        userId_templateId: {
          userId: session.user.id,
          templateId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: 'Template already purchased' }, { status: 400 });
    }

    // If template is free, just add it to user's collection
    if (template.isFree || template.price === 0) {
      const purchase = await prisma.userTextDesignTemplate.create({
        data: {
          userId: session.user.id,
          templateId,
        },
      });

      return NextResponse.json({ 
        message: 'Template added to your collection',
        purchase 
      });
    }

    // For paid templates, check user's Cozy Coins balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cozyCoins: true },
    });

    if (!user || user.cozyCoins < template.price) {
      return NextResponse.json({ 
        error: 'Insufficient Cozy Coins',
        required: template.price,
        available: user?.cozyCoins || 0,
      }, { status: 400 });
    }

    // Perform the purchase transaction
    const [purchase, updatedUser] = await prisma.$transaction([
      prisma.userTextDesignTemplate.create({
        data: {
          userId: session.user.id,
          templateId,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          cozyCoins: {
            decrement: template.price,
          },
        },
      }),
    ]);

    return NextResponse.json({ 
      message: 'Template purchased successfully',
      purchase,
      remainingCoins: updatedUser.cozyCoins,
    });
  } catch (error) {
    console.error('Error purchasing text design template:', error);
    return NextResponse.json({ error: 'Failed to purchase template' }, { status: 500 });
  }
}