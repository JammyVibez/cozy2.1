import { PATCH as patchNotification } from './PATCH';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string; notificationId: string }> }
) {
  const resolvedParams = await params;
  return patchNotification(request, { params: resolvedParams });
}
