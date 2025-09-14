import { POST as PostHandler } from './POST';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolved = await params;
  return PostHandler(request, { params: resolved });
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not implemented yet' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: 'POST method not implemented yet' }, { status: 501 });
}