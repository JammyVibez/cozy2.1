import { DELETE as deleteLikedPost } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; postId: string }> }
) {
  return deleteLikedPost(request, { params });
}
