// route.ts
import { GET as GetHandler } from './GET';
import { PATCH as PatchHandler } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  // no need to resolve params for GET
  return GetHandler(request);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PatchHandler(request, { params: resolvedParams });
}
