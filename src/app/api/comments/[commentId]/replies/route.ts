import { GET as GetHandler } from './GET';
import { POST as PostHandler } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return GetHandler(request, { params: resolvedParams });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return PostHandler(request, { params: resolvedParams });
}