import { DELETE as deleteLikedComment } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; commentId: string }> }
) {
  const resolvedParams = await params;
  return deleteLikedComment(request, { params: resolvedParams });
}
