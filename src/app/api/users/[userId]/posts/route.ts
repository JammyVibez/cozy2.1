import { GET as getPosts } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getPosts(request, { params: resolvedParams });
}
