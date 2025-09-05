import { GET as GetHandler } from './GET';
import { PATCH as PatchHandler } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return GetHandler(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return PatchHandler(request, { params });
}