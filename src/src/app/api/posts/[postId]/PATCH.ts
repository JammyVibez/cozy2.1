/**
 * PATCH /api/posts/:postId
 * - Allows an authenticated user to edit a post.
 */
import { serverWritePost } from '@/hooks/serverWritePost';

export async function PATCH(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.postId, 10);

  const formData = await request.formData();
  return serverWritePost({
    formData,
    type: 'edit',
    postId,
  });
}