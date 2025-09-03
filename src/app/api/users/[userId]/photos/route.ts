import { GET as getPhotos } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getPhotos(request, { params: resolvedParams });
}
