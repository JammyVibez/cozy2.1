import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// GET - Fetch text design for a specific comment
export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentId = parseInt(resolvedParams.commentId);

    const textDesign = await prisma.commentTextDesign.findUnique({
      where: { commentId },
      select: {
        fontFamily: true,
        fontSize: true,
        fontWeight: true,
        color: true,
        backgroundColor: true,
        border: true,
        borderRadius: true,
        padding: true,
        margin: true,
        textAlign: true,
        textShadow: true,
        boxShadow: true,
        gradient: true,
        animation: true,
        customCSS: true,
        iframeUrl: true,
      },
    });

    if (!textDesign) {
      return NextResponse.json({ error: 'No text design found' }, { status: 404 });
    }

    // Convert to styles object
    const styles = {
      fontFamily: textDesign.fontFamily,
      fontSize: textDesign.fontSize,
      fontWeight: textDesign.fontWeight,
      color: textDesign.color,
      backgroundColor: textDesign.backgroundColor,
      border: textDesign.border,
      borderRadius: textDesign.borderRadius,
      padding: textDesign.padding,
      margin: textDesign.margin,
      textAlign: textDesign.textAlign,
      textShadow: textDesign.textShadow,
      boxShadow: textDesign.boxShadow,
      background: textDesign.gradient,
      animation: textDesign.animation,
      ...textDesign.customCSS ? JSON.parse(textDesign.customCSS) : {},
    };

    return NextResponse.json({
      styles,
      iframeUrl: textDesign.iframeUrl,
    });
  } catch (error) {
    console.error('Error fetching comment text design:', error);
    return NextResponse.json({ error: 'Failed to fetch text design' }, { status: 500 });
  }
}

// PATCH - Update text design for a specific comment
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedData = body.styles;
    const updatedIframeUrl = body.iframeUrl;

    const commentIdNum = parseInt(commentId);

    // Prepare the data to be updated
    const updatePayload: any = {
      fontFamily: updatedData.fontFamily,
      fontSize: updatedData.fontSize,
      fontWeight: updatedData.fontWeight,
      color: updatedData.color,
      backgroundColor: updatedData.backgroundColor,
      border: updatedData.border,
      borderRadius: updatedData.borderRadius,
      padding: updatedData.padding,
      margin: updatedData.margin,
      textAlign: updatedData.textAlign,
      textShadow: updatedData.textShadow,
      boxShadow: updatedData.boxShadow,
      gradient: updatedData.background, // Assuming 'background' in body maps to 'gradient' in schema
      animation: updatedData.animation,
      customCSS: updatedData.customCSS ? JSON.stringify(updatedData.customCSS) : null,
    };

    const textDesign = await prisma.commentTextDesign.update({
      where: { commentId: commentIdNum },
      data: updatePayload,
    });

    // Note: iframeUrl field doesn't exist on Comment model
    // If you need to store iframe URLs, add this field to your Prisma schema first

    return NextResponse.json({ message: 'Text design updated successfully', textDesign });
  } catch (error) {
    console.error('Error updating comment text design:', error);
    return NextResponse.json({ error: 'Failed to update text design' }, { status: 500 });
  }
}