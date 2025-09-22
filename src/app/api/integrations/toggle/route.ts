
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';
import { IntegrationType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { integrationId, connect } = body;

    if (!integrationId || typeof connect !== 'boolean') {
      return NextResponse.json({ 
        error: 'Integration ID and connect status are required' 
      }, { status: 400 });
    }

    // Validate integration type
    const integrationType = integrationId.toUpperCase() as IntegrationType;
    if (!Object.values(IntegrationType).includes(integrationType)) {
      return NextResponse.json({ 
        error: 'Invalid integration type' 
      }, { status: 400 });
    }

    if (connect) {
      // Connect integration - redirect to OAuth or store connection
      const existingIntegration = await prisma.externalIntegration.findUnique({
        where: {
          userId_integrationType: {
            userId: session.user.id,
            integrationType: integrationType
          }
        }
      });

      if (existingIntegration) {
        // Update existing integration
        const updatedIntegration = await prisma.externalIntegration.update({
          where: { id: existingIntegration.id },
          data: {
            isConnected: true,
            updatedAt: new Date()
          }
        });
        
        return NextResponse.json({
          success: true,
          integration: {
            id: integrationType.toLowerCase(),
            name: getIntegrationName(integrationType),
            isConnected: true,
            connectedAt: updatedIntegration.createdAt
          }
        });
      } else {
        // Create new integration
        const newIntegration = await prisma.externalIntegration.create({
          data: {
            userId: session.user.id,
            integrationType: integrationType,
            isConnected: true,
            // For now, we'll use placeholder data
            // In real implementation, this would come from OAuth flow
            externalUserId: `placeholder_${Date.now()}`,
            username: `user_${integrationType.toLowerCase()}`
          }
        });
        
        return NextResponse.json({
          success: true,
          integration: {
            id: integrationType.toLowerCase(),
            name: getIntegrationName(integrationType),
            isConnected: true,
            connectedAt: newIntegration.createdAt
          }
        });
      }
    } else {
      // Disconnect integration
      await prisma.externalIntegration.deleteMany({
        where: {
          userId: session.user.id,
          integrationType: integrationType
        }
      });
      
      return NextResponse.json({
        success: true,
        integration: {
          id: integrationType.toLowerCase(),
          name: getIntegrationName(integrationType),
          isConnected: false
        }
      });
    }
  } catch (error) {
    console.error('Error toggling integration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getIntegrationName(type: IntegrationType): string {
  const names = {
    DISCORD: 'Discord',
    GITHUB: 'GitHub',
    TRADINGVIEW: 'TradingView',
    TWITTER: 'Twitter',
    TWITCH: 'Twitch',
    YOUTUBE: 'YouTube',
    STEAM: 'Steam',
    SPOTIFY: 'Spotify',
    REDDIT: 'Reddit',
    LINKEDIN: 'LinkedIn'
  };
  return names[type] || type;
}
