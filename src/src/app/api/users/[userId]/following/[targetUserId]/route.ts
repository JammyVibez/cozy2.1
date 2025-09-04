import { DELETE as deleteFollowing } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; targetUserId: string }> }
) {
  const resolvedParams = await params;
  return deleteFollowing(request, { params: resolvedParams });
}
