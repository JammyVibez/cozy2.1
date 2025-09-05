// route.ts
import { GET as GetHandler } from './GET';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // attach userId to query string so handler can read it
  const url = new URL(request.url);
  url.searchParams.set("userId", userId);

  const newRequest = new NextRequest(url.toString(), request);
  return GetHandler(newRequest); // ✅ only one argument
}
