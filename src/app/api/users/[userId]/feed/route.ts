import { GET as GetHandler } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return GetHandler(request, { params });
}