import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock themes data - in real implementation, fetch from database
    const themes = [
      {
        id: '1',
        name: 'Dark Neon',
        description: 'Cyberpunk-inspired dark theme with neon accents',
        price: 1.99,
        category: 'NEON',
        colorScheme: {
          primary: '#00ff88',
          secondary: '#ff0080',
          background: '#0a0a0a',
          accent: '#ff6600'
        },
        preview: '/themes/dark-neon-preview.png',
        isOwned: false
      },
      {
        id: '2',
        name: 'Gamer Pro',
        description: 'Ultimate gaming theme with RGB highlights',
        price: 2.99,
        category: 'GAMING',
        colorScheme: {
          primary: '#ff3366',
          secondary: '#3366ff',
          background: '#1a1a2e',
          accent: '#16213e'
        },
        preview: '/themes/gamer-pro-preview.png',
        isOwned: false
      },
      {
        id: '3',
        name: 'Minimal Clean',
        description: 'Clean, minimalist design for focused work',
        price: 0.99,
        category: 'MINIMAL',
        colorScheme: {
          primary: '#2563eb',
          secondary: '#64748b',
          background: '#ffffff',
          accent: '#f1f5f9'
        },
        preview: '/themes/minimal-clean-preview.png',
        isOwned: false
      },
      {
        id: '4',
        name: 'Professional',
        description: 'Sophisticated theme for business professionals',
        price: 1.49,
        category: 'PROFESSIONAL',
        colorScheme: {
          primary: '#1e40af',
          secondary: '#374151',
          background: '#f9fafb',
          accent: '#e5e7eb'
        },
        preview: '/themes/professional-preview.png',
        isOwned: false
      }
    ];

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { themeId } = body;

    if (!themeId) {
      return NextResponse.json({ 
        error: 'Theme ID is required' 
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Check if theme exists
    // 2. Check if user already owns theme
    // 3. Process payment
    // 4. Grant theme access
    // 5. Update user's owned themes

    return NextResponse.json({ 
      success: true, 
      message: 'Theme purchased successfully',
      themeId
    });
  } catch (error) {
    console.error('Error purchasing theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}