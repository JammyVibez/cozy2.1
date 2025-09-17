import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch themes from database
    const themes = await prisma.theme.findMany({
      where: { isActive: true },
      include: {
        users: {
          where: { userId: session.user.id },
          select: { id: true, isActive: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedThemes = themes.map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description || '',
      price: theme.price,
      category: theme.category,
      colorScheme: theme.colorScheme as any,
      preview: `/themes/${theme.id}-preview.png`,
      isOwned: (theme.users && theme.users.length > 0) || false
    }));

    return NextResponse.json({ themes: formattedThemes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { themeId } = body;

    if (!themeId) {
      return NextResponse.json({ 
        error: 'Theme ID is required' 
      }, { status: 400 });
    }

    // Check if theme exists and is active
    const theme = await prisma.theme.findFirst({
      where: { 
        id: themeId,
        isActive: true 
      }
    });

    if (!theme) {
      return NextResponse.json({ 
        error: 'Theme not found or inactive' 
      }, { status: 404 });
    }

    // Check if user already owns theme
    const existingPurchase = await prisma.userTheme.findUnique({
      where: {
        userId_themeId: {
          userId: session.user.id,
          themeId: themeId
        }
      }
    });

    if (existingPurchase) {
      return NextResponse.json({ 
        error: 'You already own this theme' 
      }, { status: 400 });
    }

    // If theme is free, grant access immediately
    if (theme.price === 0) {
      const purchase = await prisma.userTheme.create({
        data: {
          userId: session.user.id,
          themeId: themeId,
          isActive: false
        }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Free theme added to your collection',
        themeId,
        purchase
      });
    }

    // For paid themes, check user's Cozy Coins balance
    // Convert theme price from dollars to coins (1 dollar = 100 coins)
    const priceInCoins = Math.round(theme.price * 100);
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cozyCoins: true }
    });

    if (!user || user.cozyCoins < priceInCoins) {
      return NextResponse.json({ 
        error: 'Insufficient Cozy Coins',
        required: priceInCoins,
        available: user?.cozyCoins || 0,
        priceInDollars: theme.price
      }, { status: 400 });
    }

    // Perform the purchase transaction
    const [purchase, updatedUser] = await prisma.$transaction([
      prisma.userTheme.create({
        data: {
          userId: session.user.id,
          themeId: themeId,
          isActive: false
        }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          cozyCoins: {
            decrement: priceInCoins
          }
        }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Theme purchased successfully',
      themeId,
      purchase,
      remainingCoins: updatedUser.cozyCoins
    });
  } catch (error) {
    console.error('Error purchasing theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}