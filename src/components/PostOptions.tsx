import { Item, Section } from 'react-stately';
import { useDialogs } from '@/hooks/useDialogs';
import { GetVisualMedia } from '@/types/definitions';
import { Key, useCallback } from 'react';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { useDeletePostMutation } from '@/hooks/mutations/useDeletePostMutation';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { Delete, Edit, MoreVert } from '@/svg_components'
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments'
import { useToast } from '@/hooks/useToast'
import { useSessionUserData } from '@/hooks/useSessionUserData'
import { GetUser } from '@/types/definitions'
import { ReportButton } from './ReportButton'

export function PostOptions({
  postId,
  content,
  visualMedia,
}: {
  postId: number;
  content: string | null;
  visualMedia?: GetVisualMedia[];
}) {
  const { confirm } = useDialogs();
  const { launchEditPost } = useCreatePostModal();
  const { deleteMutation } = useDeletePostMutation();
  const { data: sessionUserData } = useSessionUserData();

  const isOwnPost = sessionUserData?.id === sessionUserData?.id; // Assuming you have a way to get the current user's ID

  const handleDeletePost = useCallback(() => {
    confirm({
      title: 'Delete Post',
      message: 'Do you really wish to delete this post?',
      onConfirm: () => {
        // Wait for the dialog to close before deleting the comment to pass the focus to
        // the next element first, preventing the focus from resetting to the top
        setTimeout(() => deleteMutation.mutate({ postId }), 300);
      },
    });
  }, [confirm, deleteMutation, postId]);

  const handleEditClick = useCallback(() => {
    launchEditPost({
      postId,
      initialContent: content ?? '',
      initialVisualMedia: visualMedia ?? [],
    });
  }, [launchEditPost, postId, content, visualMedia]);

  const handleOptionClick = useCallback(
    (key: Key) => {
      if (key === 'edit') {
        handleEditClick();
      } else if (key === 'delete') {
        handleDeletePost();
      }
      // No action for report key here as ReportButton handles its own click
    },
    [handleEditClick, handleDeletePost],
  );

  return (
    <DropdownMenuButton key={`posts-${postId}-options`} label="Post options" onAction={handleOptionClick}>
      <Section>
        <Item key="edit">Edit Post</Item>
        <Item key="delete">Delete Post</Item>
        {!isOwnPost && (
          <Item key="report">
            <ReportButton
              targetType="POST"
              targetId={postId.toString()}
              targetTitle="Post"
              className="flex items-center gap-3 w-full py-1 text-red-500 bg-transparent border-none cursor-pointer"
            >
              <span className="text-sm">🚩</span>
              <span className="text-sm">Report</span>
            </ReportButton>
          </Item>
        )}
      </Section>
    </DropdownMenuButton>
  );
}