import { NextRequest } from 'next/server';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { PATCH as PatchHandler } from './PATCH';

export async function POST(
  request: NextRequest, // ✅ Fix: use NextRequest instead of Request
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  return useUpdateProfileAndCoverPhoto({
    request,
    toUpdate: 'coverPhoto',
    userIdParam: userId,
  });
}

export async function PATCH(
  request: NextRequest, // ✅ Fix: must match PatchHandler
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PatchHandler(request, { params: resolvedParams });
}
