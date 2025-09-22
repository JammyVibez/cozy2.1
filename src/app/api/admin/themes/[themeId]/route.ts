import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/auth/checkAdminAccess';
import prisma from '@/lib/prisma/prisma';
import { z } from 'zod';

const updateThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.enum(['CLASSIC', 'NEON', 'MINIMAL', 'GAMING', 'PROFESSIONAL']).optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  colorScheme: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    accent: z.string()
  }).optional()
});

// DELETE /api/admin/themes/[themeId] - Delete theme
export async function DELETE(
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
      where: { id: themeId },
      include: {
        users: { select: { id: true } }
      }
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Check if theme is being used by users
    if (existingTheme.users.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete theme that is being used by users' },
        { status: 400 }
      );
    }

    // Delete theme from database
    await prisma.theme.delete({
      where: { id: themeId }
    });

    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/themes/[themeId] - Update theme
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
    const body = await request.json();

    // Validate input
    const validationResult = updateThemeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(issue => issue.message)
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

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

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== existingTheme.name) {
      const duplicateTheme = await prisma.theme.findFirst({
        where: { 
          name: updateData.name,
          id: { not: themeId }
        }
      });

      if (duplicateTheme) {
        return NextResponse.json(
          { error: 'Theme with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update theme in database
    const updatedTheme = await prisma.theme.update({
      where: { id: themeId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        isActive: true,
        colorScheme: true,
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
      colorScheme: updatedTheme.colorScheme as any
    };

    return NextResponse.json({
      success: true,
      theme: themeWithAnalytics,
      message: 'Theme updated successfully'
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}