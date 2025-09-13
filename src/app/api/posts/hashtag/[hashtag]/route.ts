import { GET as GetHandler } from './GET';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hashtag: string }> }
) {
  const resolved = await params;
  return GetHandler(request, { params: resolved });
}
