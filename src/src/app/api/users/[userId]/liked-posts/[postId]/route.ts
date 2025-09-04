import { DELETE as deleteLikedPost } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; postId: string }> }
) {
  const resolvedParams = await params;
  return deleteLikedPost(request, { params: resolvedParams });
}
