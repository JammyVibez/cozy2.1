import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArrowChevronBack } from '@/svg_components';
import { ThemeSelector } from '@/components/ThemeSelector';
import { AdvancedThemeSwitch } from '@/components/AdvancedThemeSwitch';

export const metadata = {
  title: 'Appearance Settings - Cozy',
  description: 'Customize themes, colors, and visual preferences',
};

export default async function AppearanceSettingsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Appearance</h1>
          <p className="text-muted-foreground">
            Customize your theme, colors, and visual preferences
          </p>
        </div>

        {/* Theme Settings */}
        <div className="space-y-6">
          {/* Basic Theme Toggle */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Theme Mode</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose between light, dark, or system theme
            </p>
            <ThemeSelector />
          </div>

          {/* Advanced Theme Settings */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Advanced Theme Options</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Customize theme variants and advanced options
            </p>
            <AdvancedThemeSwitch />
          </div>

          {/* Font Settings */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Typography</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust font size and reading preferences
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Font Size</label>
                <select className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2">
                  <option>Small</option>
                  <option>Medium (Default)</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="dyslexic-font" className="rounded" />
                <label htmlFor="dyslexic-font" className="text-sm">Use dyslexia-friendly font</label>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Accessibility</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Options to improve accessibility and usability
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="high-contrast" className="rounded" />
                <label htmlFor="high-contrast" className="text-sm">High contrast mode</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reduce-motion" className="rounded" />
                <label htmlFor="reduce-motion" className="text-sm">Reduce animations</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="focus-indicators" className="rounded" />
                <label htmlFor="focus-indicators" className="text-sm">Enhanced focus indicators</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}