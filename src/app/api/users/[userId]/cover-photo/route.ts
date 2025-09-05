// route.ts
import { NextRequest } from 'next/server';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { PATCH as PatchHandler } from './PATCH';

export async function POST(
  request: NextRequest,
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
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // ❌ don’t do: const resolvedParams = await params;
  // ✅ just forward the promise
  return PatchHandler(request, { params });
}
