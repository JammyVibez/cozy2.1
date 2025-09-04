import { GET } from './GET';
import { POST } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params;
  return GET(request, { params: resolvedParams });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params;
  return POST(request, { params: resolvedParams });
}