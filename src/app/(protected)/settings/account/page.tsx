import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { EditProfileForm } from '@/components/EditProfileForm';
import { ArrowChevronBack } from '@/svg_components';

export const metadata = {
  title: 'Account Settings - Cozy',
  description: 'Manage your account information, username, and profile details',
};

export default async function AccountSettingsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information, username, and personal details
          </p>
        </div>

        {/* Account Form */}
        <div className="rounded-xl border bg-card p-6">
          <EditProfileForm redirectTo="/settings/account" />
        </div>

        {/* Danger Zone */}
        <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These actions are irreversible. Please be certain before proceeding.
          </p>
          <div className="space-y-3">
            <button className="px-4 py-2 text-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors">
              Deactivate Account
            </button>
            <button className="px-4 py-2 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors ml-3">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}