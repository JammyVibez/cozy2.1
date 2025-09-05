import { POST as PostHandler } from './POST';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return PostHandler(request, { params });
}