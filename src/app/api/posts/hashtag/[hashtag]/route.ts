import { GET as GetHandler } from './GET';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hashtag: string }> }
) {
  // ✅ Await the params first
  const resolvedParams = await params;

  // ✅ Pass the resolved object into GetHandler
  return GetHandler(request, { params: resolvedParams });
}
