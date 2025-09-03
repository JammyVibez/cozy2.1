import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// POST - Apply text design to post, comment, or chat message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, // 'post', 'comment', or 'chat'
      targetId, // ID of the post, comment, or message
      styles, // Style object
      iframeUrl, // Optional iframe URL
    } = body;

    if (!type || !targetId || !styles) {
      return NextResponse.json({ 
        error: 'Type, target ID, and styles are required' 
      }, { status: 400 });
    }

    // Verify ownership of the target content
    let targetExists = false;
    
    if (type === 'post') {
      const post = await prisma.post.findFirst({
        where: { 
          id: parseInt(targetId),
          userId: session.user.id,
        },
      });
      targetExists = !!post;
    } else if (type === 'comment') {
      const comment = await prisma.comment.findFirst({
        where: { 
          id: parseInt(targetId),
          userId: session.user.id,
        },
      });
      targetExists = !!comment;
    } else if (type === 'chat') {
      const message = await prisma.communityMessage.findFirst({
        where: { 
          id: targetId,
          senderId: session.user.id,
        },
      });
      targetExists = !!message;
    }

    if (!targetExists) {
      return NextResponse.json({ 
        error: 'Target content not found or not owned by user' 
      }, { status: 404 });
    }

    // Apply the text design
    let design;
    
    if (type === 'post') {
      design = await prisma.postTextDesign.upsert({
        where: { postId: parseInt(targetId) },
        update: {
          ...styles,
          iframeUrl,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          postId: parseInt(targetId),
          ...styles,
          iframeUrl,
        },
      });
    } else if (type === 'comment') {
      design = await prisma.commentTextDesign.upsert({
        where: { commentId: parseInt(targetId) },
        update: {
          ...styles,
          iframeUrl,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          commentId: parseInt(targetId),
          ...styles,
          iframeUrl,
        },
      });
    } else if (type === 'chat') {
      design = await prisma.chatTextDesign.upsert({
        where: { messageId: targetId },
        update: {
          ...styles,
          iframeUrl,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          messageId: targetId,
          ...styles,
          iframeUrl,
        },
      });
    }

    return NextResponse.json({ 
      message: 'Text design applied successfully',
      design 
    });
  } catch (error) {
    console.error('Error applying text design:', error);
    return NextResponse.json({ error: 'Failed to apply text design' }, { status: 500 });
  }
}

// DELETE - Remove text design from content
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const targetId = searchParams.get('targetId');

    if (!type || !targetId) {
      return NextResponse.json({ 
        error: 'Type and target ID are required' 
      }, { status: 400 });
    }

    // Remove the text design
    if (type === 'post') {
      await prisma.postTextDesign.deleteMany({
        where: { 
          postId: parseInt(targetId),
          userId: session.user.id,
        },
      });
    } else if (type === 'comment') {
      await prisma.commentTextDesign.deleteMany({
        where: { 
          commentId: parseInt(targetId),
          userId: session.user.id,
        },
      });
    } else if (type === 'chat') {
      await prisma.chatTextDesign.deleteMany({
        where: { 
          messageId: targetId,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ message: 'Text design removed successfully' });
  } catch (error) {
    console.error('Error removing text design:', error);
    return NextResponse.json({ error: 'Failed to remove text design' }, { status: 500 });
  }
}