import { GET as GetHandler } from './GET';
import { POST as PostHandler } from './POST';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  return GetHandler(request, { params });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  return PostHandler(request, { params });
}