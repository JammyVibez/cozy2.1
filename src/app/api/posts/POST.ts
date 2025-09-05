/**
 * POST /api/posts
 * - Allows an authenticated user to create a post.
 */
import { serverWritePost } from '@/hooks/serverWritePost';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return serverWritePost({ formData, type: 'create' });
}