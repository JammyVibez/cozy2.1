import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { PATCH as patchCoverPhoto } from './PATCH';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  return useUpdateProfileAndCoverPhoto({
    request,
    toUpdate: 'coverPhoto',
    userIdParam: params.userId,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return patchCoverPhoto(request, { params: resolvedParams });
}