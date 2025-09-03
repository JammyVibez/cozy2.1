import { POST as postFollowing } from './POST';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return postFollowing(request, { params: resolvedParams });
}
