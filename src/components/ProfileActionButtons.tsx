'use client';

import Button from '@/components/ui/Button';
import { useFollowsMutations } from '@/hooks/mutations/useFollowsMutations';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import { useCallback } from 'react';
import { ReportButton } from './ReportButton';

export function ProfileActionButtons({ targetUserId }: { targetUserId: string }) {
  const { data: targetUser, isPending } = useUserQuery(targetUserId);
  const isFollowing = targetUser?.isFollowing;
  const { followMutation, unFollowMutation } = useFollowsMutations({
    targetUserId,
  });

  const handleClick = useCallback(() => {
    if (isFollowing) {
      unFollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  }, [isFollowing, followMutation, unFollowMutation]);

  return (
    <div className="flex flex-row items-center gap-2 md:gap-4">
      <Button onPress={handleClick} mode={isFollowing ? 'secondary' : 'primary'} shape="pill" loading={isPending}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      {/* <Button Icon={Mail} onPress={() => {}} mode="secondary" size="medium" /> */}
      <ReportButton
        targetType="USER"
        targetId={targetUserId}
        targetTitle={`@${targetUser?.username ?? ''}`}
        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
      >
        🚩
      </ReportButton>
    </div>
  );
}