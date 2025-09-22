import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';
import { IntegrationType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's connected integrations
    const userIntegrations = await prisma.externalIntegration.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        integrationType: true,
        externalUserId: true,
        username: true,
        isConnected: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Create a comprehensive list of all available integrations
    const allIntegrations = Object.values(IntegrationType).map(type => {
      const userIntegration = userIntegrations.find(integration => integration.integrationType === type);
      
      return {
        id: type.toLowerCase(),
        name: getIntegrationName(type),
        description: getIntegrationDescription(type),
        icon: getIntegrationIcon(type),
        category: getIntegrationCategory(type),
        isConnected: userIntegration?.status === 'connected',
        connectedAt: userIntegration?.createdAt,
        username: userIntegration?.username,
        status: userIntegration?.status || 'disconnected'
      };
    });

    return NextResponse.json({
      integrations: allIntegrations
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
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

function getIntegrationDescription(type: IntegrationType): string {
  const descriptions = {
    DISCORD: 'Connect your Discord servers and display status',
    GITHUB: 'Share your repositories and coding activity',
    TRADINGVIEW: 'Display your trading charts and market analysis',
    TWITTER: 'Cross-post and sync your tweets',
    TWITCH: 'Show your streaming status and highlights',
    YOUTUBE: 'Share your latest videos and channel updates',
    STEAM: 'Display your gaming activity and achievements',
    SPOTIFY: 'Share what you\'re listening to',
    REDDIT: 'Sync your posts and karma',
    LINKEDIN: 'Connect your professional network'
  };
  return descriptions[type] || `Connect your ${type.toLowerCase()} account`;
}

function getIntegrationIcon(type: IntegrationType): string {
  const icons = {
    DISCORD: '🎮',
    GITHUB: '⚡',
    TRADINGVIEW: '📈',
    TWITTER: '🐦',
    TWITCH: '📺',
    YOUTUBE: '📹',
    STEAM: '🎮',
    SPOTIFY: '🎵',
    REDDIT: '🔶',
    LINKEDIN: '💼'
  };
  return icons[type] || '🔗';
}

function getIntegrationCategory(type: IntegrationType): string {
  const categories = {
    DISCORD: 'social',
    GITHUB: 'developer',
    TRADINGVIEW: 'finance',
    TWITTER: 'social',
    TWITCH: 'entertainment',
    YOUTUBE: 'entertainment',
    STEAM: 'gaming',
    SPOTIFY: 'entertainment',
    REDDIT: 'social',
    LINKEDIN: 'professional'
  };
  return categories[type] || 'other';
}