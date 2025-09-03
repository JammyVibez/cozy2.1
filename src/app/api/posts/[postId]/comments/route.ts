import { GET as getComments } from './GET';
import { POST as postComment } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params;
  return getComments(request, { params: resolvedParams });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params;
  return postComment(request, { params: resolvedParams });
}
