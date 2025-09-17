
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
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

    const resolvedParams = await params;
    const { reportId } = resolvedParams;
    const { status, actionType, actionReason } = await request.json();

    // Find the report
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        moderatorAction: true
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status || report.status,
        updatedAt: new Date()
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

    // Create moderator action if provided
    if (actionType && actionReason) {
      await prisma.reportAction.create({
        data: {
          actionType,
          reason: actionReason,
          moderatorId: session.user.id,
          reportId
        }
      });

      // Perform actual action based on actionType
      if (actionType === 'CONTENT_REMOVED') {
        if (report.targetType === 'POST') {
          await prisma.post.delete({
            where: { id: parseInt(report.targetId) }
          });
        } else if (report.targetType === 'COMMENT') {
          await prisma.comment.delete({
            where: { id: parseInt(report.targetId) }
          });
        }
      } else if (actionType === 'USER_SUSPENDED') {
        // Get target user ID
        let targetUserId = null;
        if (report.targetType === 'USER') {
          targetUserId = report.targetId;
        } else if (report.targetType === 'POST') {
          const post = await prisma.post.findUnique({
            where: { id: parseInt(report.targetId) },
            select: { userId: true }
          });
          targetUserId = post?.userId;
        } else if (report.targetType === 'COMMENT') {
          const comment = await prisma.comment.findUnique({
            where: { id: parseInt(report.targetId) },
            select: { userId: true }
          });
          targetUserId = comment?.userId;
        }

        if (targetUserId) {
          const suspensionDate = new Date();
          suspensionDate.setDate(suspensionDate.getDate() + 7); // 7 day suspension

          await prisma.user.update({
            where: { id: targetUserId },
            data: {
              suspendedUntil: suspensionDate,
              isActive: false
            }
          });
        }
      } else if (actionType === 'USER_BANNED') {
        // Similar logic for banning
        let targetUserId = null;
        if (report.targetType === 'USER') {
          targetUserId = report.targetId;
        } else if (report.targetType === 'POST') {
          const post = await prisma.post.findUnique({
            where: { id: parseInt(report.targetId) },
            select: { userId: true }
          });
          targetUserId = post?.userId;
        } else if (report.targetType === 'COMMENT') {
          const comment = await prisma.comment.findUnique({
            where: { id: parseInt(report.targetId) },
            select: { userId: true }
          });
          targetUserId = comment?.userId;
        }

        if (targetUserId) {
          await prisma.user.update({
            where: { id: targetUserId },
            data: {
              isBanned: true,
              bannedAt: new Date(),
              bannedBy: session.user.id,
              banReason: `Banned due to report: ${actionReason}`,
              isActive: false
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Report updated successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
