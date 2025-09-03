/**
 * DELETE /api/users/:userId/following/:targetUserId
 * - Allows an authenticated user to remove a user
 * from their following list / unfollow the :targetUserId.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string; targetUserId: string }> }) {
  const [user] = await getServerUser();
  const { userId, targetUserId } = await params;
  if (!user || user.id !== userId) return NextResponse.json({}, { status: 403 });

  const isFollowing = await prisma.follow.count({
    where: {
      followerId: user.id,
      followingId: targetUserId,
    },
  });

  if (isFollowing) {
    const res = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    // Delete the associated 'CREATE_FOLLOW' activity
    await prisma.activity.deleteMany({
      where: {
        type: 'CREATE_FOLLOW',
        sourceId: res.id,
        sourceUserId: user.id,
        targetUserId: targetUserId,
      },
    });

    return NextResponse.json({ unfollowed: true });
  }
  return NextResponse.json({ error: 'You are not following this user.' }, { status: 409 });
}
