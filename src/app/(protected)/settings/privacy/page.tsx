import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrivacySettings } from '@/components/PrivacySettings';
import { ArrowChevronBack } from '@/svg_components';

export const metadata = {
  title: 'Privacy & Security - Cozy',
  description: 'Control who can see your information and contact you',
};

export default async function PrivacySettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/settings" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowChevronBack className="h-4 w-4" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold mb-2">Privacy & Security</h1>
          <p className="text-muted-foreground">
            Control who can see your information and how you want to be contacted
          </p>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-xl border bg-card p-6">
          <PrivacySettings />
        </div>
      </div>
    </div>
  );
}