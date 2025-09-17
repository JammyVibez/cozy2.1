
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent activities from the last 24 hours
    const activities = await prisma.activity.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        sourceUser: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id.toString(),
      type: activity.type.toLowerCase(),
      user: {
        name: activity.sourceUser.name || 'Anonymous',
        username: activity.sourceUser.username || 'anonymous',
        profilePhoto: activity.sourceUser.profilePhoto
      },
      timestamp: activity.createdAt.toISOString()
    }));

    return NextResponse.json({ activities: formattedActivities });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
