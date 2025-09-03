import { GET as getFeed } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getFeed(request, { params: resolvedParams });
}
