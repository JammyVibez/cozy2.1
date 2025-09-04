import { POST as PostHandler } from './POST';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PostHandler(request, { params: resolvedParams });
}