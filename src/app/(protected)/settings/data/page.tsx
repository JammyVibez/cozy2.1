import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArrowChevronBack } from '@/svg_components';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Data & Storage - Cozy',
  description: 'Download your data, manage storage, and export settings',
};

export default async function DataSettingsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Data & Storage</h1>
          <p className="text-muted-foreground">
            Manage your data, downloads, and storage preferences
          </p>
        </div>

        {/* Storage Overview */}
        <div className="mb-6 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Storage Usage</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Photos & Videos</span>
              <span className="text-sm text-muted-foreground">2.3 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '46%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">5 GB</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">2.3 GB</div>
                <div className="text-muted-foreground">Used</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">2.7 GB</div>
                <div className="text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Export Your Data</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Download a copy of your data including posts, messages, and media
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">What's included:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• All your posts and comments</li>
                  <li>• Photos and videos you've uploaded</li>
                  <li>• Your profile information</li>
                  <li>• Message history</li>
                  <li>• Community memberships</li>
                </ul>
              </div>
              <div className="pt-4">
                <Button>Request Data Export</Button>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll email you a link to download your data within 48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Data Retention</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Control how long your data is stored
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Automatically delete posts older than:</label>
                <select className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2">
                  <option>Never</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>5 years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Automatically delete messages older than:</label>
                <select className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2">
                  <option>Never</option>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2 years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cache Settings */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Cache & Offline Data</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage cached content and offline storage
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cache Media</h3>
                  <p className="text-sm text-muted-foreground">Store images and videos locally for faster loading</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Offline Mode</h3>
                  <p className="text-sm text-muted-foreground">Download content for offline viewing</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="pt-2">
                <Button mode="secondary">Clear Cache</Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Clears cached images and temporary files (47 MB)
                </p>
              </div>
            </div>
          </div>

          {/* Import/Export Settings */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Import/Export Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Transfer your preferences between devices
            </p>
            <div className="flex gap-3">
              <Button mode="secondary">Export Settings</Button>
              <Button mode="secondary">Import Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}