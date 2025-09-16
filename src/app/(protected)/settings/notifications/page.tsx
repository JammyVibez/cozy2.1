import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArrowChevronBack } from '@/svg_components';

export const metadata = {
  title: 'Notification Settings - Cozy',
  description: 'Manage email, push, and in-app notification preferences',
};

export default async function NotificationSettingsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Control how and when you receive notifications
          </p>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          {/* Push Notifications */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Push Notifications</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Receive real-time notifications on your device
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Messages</h3>
                  <p className="text-sm text-muted-foreground">Get notified of new direct messages</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Likes & Reactions</h3>
                  <p className="text-sm text-muted-foreground">When someone likes or reacts to your posts</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Followers</h3>
                  <p className="text-sm text-muted-foreground">When someone follows you</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comments</h3>
                  <p className="text-sm text-muted-foreground">When someone comments on your posts</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Receive notifications via email
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weekly Digest</h3>
                  <p className="text-sm text-muted-foreground">Summary of activity from the past week</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Security Alerts</h3>
                  <p className="text-sm text-muted-foreground">Important account security notifications</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Product Updates</h3>
                  <p className="text-sm text-muted-foreground">News about new features and updates</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tips & Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Helpful tips to get the most out of Cozy</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>

          {/* Community Notifications */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Community Notifications</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Notifications from communities you're part of
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Community Posts</h3>
                  <p className="text-sm text-muted-foreground">When new posts are made in your communities</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Community Events</h3>
                  <p className="text-sm text-muted-foreground">Upcoming events in your communities</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Moderation Actions</h3>
                  <p className="text-sm text-muted-foreground">When moderators take action on your content</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          {/* Do Not Disturb */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Do Not Disturb</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Set quiet hours when you don't want to receive notifications
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="dnd-enabled" className="rounded" />
                <label htmlFor="dnd-enabled" className="text-sm">Enable Do Not Disturb</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input type="time" defaultValue="22:00" className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <input type="time" defaultValue="08:00" className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}