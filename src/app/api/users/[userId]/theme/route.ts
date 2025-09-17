import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const themeSchema = z.object({
  theme: z.string(),
});

// PATCH /api/users/[userId]/theme - Update user's theme preference
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Users can only update their own theme
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { theme } = themeSchema.parse(body);

    // Save theme preference to user's profile
    await prisma.user.update({
      where: { id: userId },
      data: { 
        preferredTheme: theme 
      }
    });
    
    return NextResponse.json({
      success: true,
      theme: theme,
      message: 'Theme preference saved'
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}