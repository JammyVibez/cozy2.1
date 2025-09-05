import { DELETE as DeleteHandler } from './DELETE';
import { PUT as PutHandler } from './PUT';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  return DeleteHandler(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  return PutHandler(request, { params });
}