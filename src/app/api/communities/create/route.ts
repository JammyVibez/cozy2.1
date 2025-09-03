import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, theme, isPublic } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json({ 
        error: 'Name and category are required' 
      }, { status: 400 });
    }

    // Check if community name already exists
    const existingCommunity = await prisma.community.findUnique({
      where: { name },
    });

    if (existingCommunity) {
      return NextResponse.json({ 
        error: 'A community with this name already exists' 
      }, { status: 400 });
    }

    // Create the community
    const community = await prisma.community.create({
      data: {
        name,
        description,
        category,
        theme: theme || 'DEFAULT',
        isPublic: isPublic !== false, // Default to public
        creatorId: session.user.id,
      },
    });

    // Add creator as admin member
    await prisma.communityMember.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
        role: 'ADMIN',
      },
    });

    // Create default zones for the community
    const defaultZones = [
      { name: 'General', description: 'General discussion', emoji: '💬', order: 0 },
      { name: 'Announcements', description: 'Important updates', emoji: '📢', order: 1 },
    ];

    await prisma.communityZone.createMany({
      data: defaultZones.map(zone => ({
        ...zone,
        communityId: community.id,
        permissions: ['VIEW', 'POST', 'COMMENT'],
      })),
    });

    return NextResponse.json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        category: community.category,
        theme: community.theme,
      },
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}