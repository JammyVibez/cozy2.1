import { GET as GetHandler } from './GET';
import { DELETE as DeleteHandler } from './DELETE';
import { PATCH as PatchHandler } from './PATCH';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    return GetHandler(request, { params });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    return DeleteHandler(request, { params });
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    return PatchHandler(request, { params });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}