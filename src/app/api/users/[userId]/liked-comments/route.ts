import { POST as postLikedComments } from './POST';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return postLikedComments(request, { params: resolvedParams });
}
