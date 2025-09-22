import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const discordSettingsSchema = z.object({
  showIframe: z.boolean().optional(),
  selectedNameplate: z.string().optional(),
  customBanner: z.string().nullable().optional(),
});

// GET /api/users/[userId]/discord-settings - Get user's Discord customization settings
export async function GET(
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

    // Check if user is accessing their own settings or is an admin
    if (session.user.id !== userId) {
      // Fetch user role from database to check admin access
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      });
      
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Get Discord integration settings for the user
    const discordIntegration = await prisma.externalIntegration.findFirst({
      where: {
        userId: userId,
        integrationType: 'DISCORD'
      }
    });

    const settings = discordIntegration?.connectionData as any || {};

    return NextResponse.json({
      showIframe: settings.showIframe || false,
      selectedNameplate: settings.selectedNameplate || 'Default',
      customBanner: settings.customBanner || null,
    });
  } catch (error) {
    console.error('Error fetching Discord settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Discord settings' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[userId]/discord-settings - Update user's Discord customization settings
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

    // Users can only update their own settings
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = discordSettingsSchema.parse(body);

    // Get or create Discord integration
    let discordIntegration = await prisma.externalIntegration.findFirst({
      where: {
        userId: userId,
        integrationType: 'DISCORD'
      }
    });

    if (!discordIntegration) {
      discordIntegration = await prisma.externalIntegration.create({
        data: {
          userId: userId,
          integrationType: 'DISCORD',
          isConnected: false,
          connectionData: {}
        }
      });
    }

    // Update Discord settings
    const currentSettings = discordIntegration.connectionData as any || {};
    const newSettings = { ...currentSettings, ...validatedData };

    const updatedIntegration = await prisma.externalIntegration.update({
      where: { id: discordIntegration.id },
      data: { connectionData: newSettings }
    });

    return NextResponse.json({
      success: true,
      settings: {
        showIframe: newSettings.showIframe || false,
        selectedNameplate: newSettings.selectedNameplate || 'Default',
        customBanner: newSettings.customBanner || null,
      }
    });
  } catch (error) {
    console.error('Error updating Discord settings:', error);
    return NextResponse.json(
      { error: 'Failed to update Discord settings' },
      { status: 500 }
    );
  }
}