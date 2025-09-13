// route.ts
import { GET as GetHandler } from './GET';
import { PATCH as PatchHandler } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  // GET handler only needs request parameter, not params
  return GetHandler(request);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolved = await params;
  return PatchHandler(request, { params: resolved });
}
