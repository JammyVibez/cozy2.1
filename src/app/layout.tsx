import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/cn';
import { Providers } from '@/components/Providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import { RealTimeNotifications } from '@/components/RealTimeNotifications';
import { PWAInstaller } from '@/components/PWAInstaller';
import { auth } from '@/auth';
import React from 'react';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Cozy - Your Space to Connect',
    template: '%s | Cozy',
  },
  description: 'Cozy — your space to share, connect, and feel at home online. A modern, community-driven social platform where people can connect, share, and engage.',
  keywords: ['social media', 'community', 'cozy', 'connect', 'chat', 'stories', 'posts', 'reactions', 'trending'],
  authors: [{ name: 'Cozy Team' }],
  creator: 'Cozy',
  metadataBase: new URL(process.env.URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Cozy - Your Space to Connect',
    description: 'Your space to share, connect, and feel at home online',
    siteName: 'Cozy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozy - Your Space to Connect',
    description: 'Your space to share, connect, and feel at home online',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cozy',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Cozy',
    'msapplication-TileColor': '#f59e0b',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={cn('bg-background text-foreground overflow-y-scroll', poppins.className)}>
        <ThemeProvider>
          <Providers session={session}>
            {children}
            <RealTimeNotifications />
            <PWAInstaller />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
