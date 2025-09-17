
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';
import { CreateReport, ReportCategory } from '@/types/definitions';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: CreateReport = await request.json();

    // Validate required fields
    if (!data.targetType || !data.targetId || !data.reason || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate target exists
    let targetExists = false;
    
    if (data.targetType === 'POST') {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(data.targetId) }
      });
      targetExists = !!post;
    } else if (data.targetType === 'COMMENT') {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(data.targetId) }
      });
      targetExists = !!comment;
    } else if (data.targetType === 'USER') {
      const user = await prisma.user.findUnique({
        where: { id: data.targetId }
      });
      targetExists = !!user;
    }

    if (!targetExists) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Check if user already reported this target
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetType: data.targetType,
        targetId: data.targetId
      }
    });

    if (existingReport) {
      return NextResponse.json({ error: 'You have already reported this content' }, { status: 400 });
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason.trim(),
        category: data.category,
        description: data.description?.trim() || null,
        reporterId: session.user.id
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      report
    });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin privileges
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true }
    });
    
    const isAdmin = adminUser?.role === 'ADMIN' || 
                   adminUser?.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        },
        moderatorAction: {
          include: {
            moderator: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePhoto: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Fetch additional target data
    const reportsWithTargets = await Promise.all(
      reports.map(async (report) => {
        let targetData = null;

        if (report.targetType === 'POST') {
          targetData = await prisma.post.findUnique({
            where: { id: parseInt(report.targetId) },
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profilePhoto: true
                }
              }
            }
          });
        } else if (report.targetType === 'COMMENT') {
          targetData = await prisma.comment.findUnique({
            where: { id: parseInt(report.targetId) },
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profilePhoto: true
                }
              }
            }
          });
        } else if (report.targetType === 'USER') {
          targetData = await prisma.user.findUnique({
            where: { id: report.targetId },
            select: {
              id: true,
              name: true,
              username: true,
              profilePhoto: true
            }
          });
        }

        return {
          ...report,
          targetData
        };
      })
    );

    const total = await prisma.report.count({ where });

    return NextResponse.json({
      success: true,
      reports: reportsWithTargets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
