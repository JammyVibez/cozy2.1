import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/auth/checkAdminAccess';
import prisma from '@/lib/prisma/prisma';
import { z } from 'zod';

const createThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['CLASSIC', 'NEON', 'MINIMAL', 'GAMING', 'PROFESSIONAL']),
  price: z.number().min(0, 'Price must be non-negative'),
  colorScheme: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    accent: z.string()
  })
});

// GET /api/admin/themes - Get all themes with admin data
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAccess();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch themes from database with usage analytics
    const themes = await prisma.theme.findMany({
      include: {
        users: {
          select: {
            purchasedAt: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate analytics for each theme
    const themesWithAnalytics = themes.map(theme => {
      const usage = theme.users.filter(ut => ut.isActive).length;
      const revenue = theme.users.length * theme.price;
      
      return {
        id: theme.id,
        name: theme.name,
        description: theme.description || '',
        category: theme.category,
        price: theme.price,
        isActive: theme.isActive,
        usage,
        revenue,
        colorScheme: theme.colorScheme as any,
        createdAt: theme.createdAt?.toISOString(),
        updatedAt: theme.updatedAt?.toISOString()
      };
    });

    const totalRevenue = themesWithAnalytics.reduce((sum, theme) => sum + theme.revenue, 0);
    const totalUsage = themesWithAnalytics.reduce((sum, theme) => sum + theme.usage, 0);
    const activeThemes = themesWithAnalytics.filter(theme => theme.isActive).length;

    return NextResponse.json({ 
      themes: themesWithAnalytics,
      totalRevenue,
      totalUsage,
      activeThemes
    });
  } catch (error) {
    console.error('Error fetching admin themes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/themes - Create new theme
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAccess();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = createThemeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(issue => issue.message)
        },
        { status: 400 }
      );
    }

    const { name, description, category, price, colorScheme } = validationResult.data;

    // Check for duplicate theme name
    const existingTheme = await prisma.theme.findFirst({
      where: { name }
    });

    if (existingTheme) {
      return NextResponse.json(
        { error: 'Theme with this name already exists' },
        { status: 409 }
      );
    }

    // Create theme in database
    const newTheme = await prisma.theme.create({
      data: {
        name,
        description,
        category,
        price,
        colorScheme,
        isActive: true
      },
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
    const themeWithAnalytics = {
      id: newTheme.id,
      name: newTheme.name,
      description: newTheme.description || '',
      category: newTheme.category,
      price: newTheme.price,
      isActive: newTheme.isActive,
      usage: 0, // New theme has no users yet
      revenue: 0,
      colorScheme: newTheme.colorScheme as any,
      createdAt: newTheme.createdAt?.toISOString(),
      updatedAt: newTheme.updatedAt?.toISOString()
    };

    return NextResponse.json({
      success: true,
      theme: themeWithAnalytics,
      message: 'Theme created successfully'
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}