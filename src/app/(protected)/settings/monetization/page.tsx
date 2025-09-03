import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ThemeMarketplace } from '@/components/ThemeMarketplace';
import { PremiumBadge } from '@/components/PremiumBadge';
import Button from '@/components/ui/Button';

export default async function MonetizationPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monetization & Customization</h1>
          <p className="text-muted-foreground">
            Upgrade your experience with premium features, themes, and creator tools
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🪙</span>
              <h3 className="font-semibold">Cozy Coins</h3>
            </div>
            <div className="text-2xl font-bold text-amber-600">100</div>
            <p className="text-sm text-muted-foreground">Available balance</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💰</span>
              <h3 className="font-semibold">Tips Received</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">247</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎨</span>
              <h3 className="font-semibold">Themes Owned</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-sm text-muted-foreground">Active: Dark Neon</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">✨</span>
              <h3 className="font-semibold">Badge Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <PremiumBadge type="VERIFIED" size="small" />
            </div>
            <p className="text-sm text-muted-foreground">Premium member</p>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Premium Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Premium Badges */}
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="text-xl font-bold">Premium Badges</h3>
                  <p className="text-muted-foreground">Stand out with verified status</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <PremiumBadge type="VERIFIED" size="small" />
                    <span className="font-medium">Verified Badge</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <PremiumBadge type="CREATOR" size="small" />
                    <span className="font-medium">Creator Badge</span>
                  </div>
                  <Button size="small">$7.99</Button>
                </div>
              </div>
              
              <Button className="w-full">
                Manage Badges
              </Button>
            </div>

            {/* Cozy Coins */}
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🪙</span>
                <div>
                  <h3 className="text-xl font-bold">Cozy Coins</h3>
                  <p className="text-muted-foreground">Tip creators and boost posts</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="text-3xl font-bold text-amber-600 mb-2">100</div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button mode="secondary">
                  Purchase Coins
                </Button>
                <Button mode="secondary">
                  View History
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Marketplace */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Theme Marketplace</h2>
          <ThemeMarketplace />
        </div>
      </div>
    </div>
  );
}