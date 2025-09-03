import { GET as getReplies } from './GET';
import { POST as postReply } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return getReplies(request, { params: resolvedParams });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return postReply(request, { params: resolvedParams });
}
