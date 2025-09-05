import { DELETE as deleteLikedComment } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; commentId: string }> }
) {
  return deleteLikedComment(request, { params });
}
