import { GET as GetHandler } from './GET';
import { POST as PostHandler } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return GetHandler(request, { params });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolved = await params;
  return PostHandler(request, { params: resolved });
}