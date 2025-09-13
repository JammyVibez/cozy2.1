import { POST as PostHandler } from './POST';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolved = await params;
  return PostHandler(request, { params: resolved });
}