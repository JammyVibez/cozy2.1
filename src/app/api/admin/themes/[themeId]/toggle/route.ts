import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/auth/checkAdminAccess';
import prisma from '@/lib/prisma/prisma';

// PUT /api/admin/themes/[themeId]/toggle - Toggle theme active status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ themeId: string }> }
) {
  try {
    const { isAdmin } = await checkAdminAccess();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { themeId } = await params;

    // Check if theme exists
    const existingTheme = await prisma.theme.findUnique({
      where: { id: themeId }
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Toggle theme active status
    const updatedTheme = await prisma.theme.update({
      where: { id: themeId },
      data: { isActive: !existingTheme.isActive },
      include: {
        users: {
          select: {
            purchasedAt: true,
            isActive: true
          }
        }
      }
    });

    // Format response with analytics
    const usage = updatedTheme.users.filter(ut => ut.isActive).length;
    const revenue = updatedTheme.users.length * updatedTheme.price;
    
    const themeWithAnalytics = {
      id: updatedTheme.id,
      name: updatedTheme.name,
      description: updatedTheme.description || '',
      category: updatedTheme.category,
      price: updatedTheme.price,
      isActive: updatedTheme.isActive,
      usage,
      revenue,
      colorScheme: updatedTheme.colorScheme as any,
      createdAt: updatedTheme.createdAt?.toISOString(),
      updatedAt: updatedTheme.updatedAt?.toISOString()
    };

    return NextResponse.json({
      success: true,
      theme: themeWithAnalytics,
      message: `Theme ${updatedTheme.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}