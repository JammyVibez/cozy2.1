import { GET } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hashtag: string }> }
) {
  const resolvedParams = await params;
  return GET(request, { params: resolvedParams });
}