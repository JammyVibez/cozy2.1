import { GET as getActivity } from './GET';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return getActivity(request, { params: resolvedParams });
}
