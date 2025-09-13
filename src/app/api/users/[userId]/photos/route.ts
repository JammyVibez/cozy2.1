import { GET as GetHandler } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolved = await params;
  return GetHandler(request, { params: resolved });
}