import { GET as getNotifications } from './GET';
import { PATCH as patchNotifications } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getNotifications(request, { params: resolvedParams });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return patchNotifications(request, { params: resolvedParams });
}
