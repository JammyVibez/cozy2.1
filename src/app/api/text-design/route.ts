import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

// GET - Fetch available text design templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const templates = await prisma.textDesignTemplate.findMany({
      where: {
        isActive: true,
        ...(category && { category: category as any }),
      },
      include: {
        purchases: {
          where: { userId: session.user.id },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const templatesWithPurchaseInfo = templates.map(template => ({
      ...template,
      isPurchased: template.purchases.length > 0 || template.isFree,
      purchases: undefined, // Remove sensitive data
    }));

    return NextResponse.json({ templates: templatesWithPurchaseInfo });
  } catch (error) {
    console.error('Error fetching text design templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create a new text design template (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you can implement your own admin check)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // For now, allow any logged-in user to create templates
    // You can add admin role check here later

    const body = await request.json();
    const { name, description, category, price, isFree, preview, styles, iframeUrl } = body;

    const template = await prisma.textDesignTemplate.create({
      data: {
        name,
        description,
        category,
        price: price || 0,
        isFree: isFree || false,
        preview,
        styles,
        iframeUrl,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error creating text design template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}