import { DELETE as deleteFollowing } from './DELETE';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string; targetUserId: string }> }
) {
  return deleteFollowing(request, { params });
}
