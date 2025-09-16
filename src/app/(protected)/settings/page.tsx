import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Profile, Shield, Palette, Bell, Database, Coins, ArrowChevronForward } from '@/svg_components';

export const metadata = {
  title: 'Settings - Cozy',
  description: 'Manage your account settings, privacy, themes, and preferences',
};

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
}

function SettingsCard({ title, description, icon: Icon, href, badge }: SettingsCardProps) {
  return (
    <Link href={href}>
      <div className="group flex items-center justify-between rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:border-primary/30">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              {badge}
            </span>
          )}
          <ArrowChevronForward className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const settingsCategories = [
    {
      title: 'Account',
      description: 'Manage your profile, email, and basic account settings',
      icon: Profile,
      href: '/settings/account',
    },
    {
      title: 'Privacy & Security',
      description: 'Control who can see your information and contact you',
      icon: Shield,
      href: '/settings/privacy',
    },
    {
      title: 'Appearance',
      description: 'Customize themes, colors, and visual preferences',
      icon: Palette,
      href: '/settings/appearance',
    },
    {
      title: 'Notifications',
      description: 'Manage email, push, and in-app notification preferences',
      icon: Bell,
      href: '/settings/notifications',
    },
    {
      title: 'Data & Storage',
      description: 'Download your data, manage storage, and export settings',
      icon: Database,
      href: '/settings/data',
    },
    {
      title: 'Monetization',
      description: 'Premium features, themes, and creator tools',
      icon: Coins,
      href: '/settings/monetization',
      badge: 'Pro',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and customize your Cozy experience
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-4">
          {settingsCategories.map((category) => (
            <SettingsCard key={category.href} {...category} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">127</div>
              <p className="text-sm text-muted-foreground">Posts Created</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1.2k</div>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3.4k</div>
              <p className="text-sm text-muted-foreground">Likes Received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}