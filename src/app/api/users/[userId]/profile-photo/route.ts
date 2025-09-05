import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { PATCH as PatchHandler } from './PATCH';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest, // ✅ use NextRequest for consistency
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return useUpdateProfileAndCoverPhoto({
    request,
    toUpdate: 'profilePhoto',
    userIdParam: userId,
  });
}

export async function PATCH(
  request: NextRequest, // ✅ match PATCH.ts
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PatchHandler(request, { params: resolvedParams });
}
