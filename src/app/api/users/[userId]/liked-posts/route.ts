import { GET as getLikedPosts } from './GET';
import { POST as postLikedPosts } from './POST';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getLikedPosts(request, { params: resolvedParams });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return postLikedPosts(request, { params: resolvedParams });
}
