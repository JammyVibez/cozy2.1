import { GET as GetHandler } from './GET';
import { PATCH as PatchHandler } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return GetHandler(request, { params: resolvedParams });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PatchHandler(request, { params: resolvedParams });
}