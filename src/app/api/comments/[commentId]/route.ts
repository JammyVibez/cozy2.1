import { DELETE as DeleteHandler } from './DELETE';
import { PUT as PutHandler } from './PUT';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return DeleteHandler(request, { params: resolvedParams });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  return PutHandler(request, { params: resolvedParams });
}