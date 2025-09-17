import { Suspense } from 'react';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { Posts } from '@/components/Posts';
import { GenericLoading } from '@/components/GenericLoading';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Cozy | Feed',
};

export default async function Page() {
  const [user] = await getServerUser();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      {/* Enhanced Header Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Your Feed
              </h1>
              <p className="text-sm text-muted-foreground">Stay connected with your community</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 dark:text-green-300 font-medium">Live</span>
              </div>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Status Updates Section */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
                <h3 className="font-semibold text-lg">Status Updates</h3>
              </div>
              <Suspense fallback={<div className="animate-pulse h-20 bg-muted rounded-lg"></div>}>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Share what you're up to...</div>
                  {/* Status viewer will be added here */}
                </div>
              </Suspense>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  👋
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Welcome back, {user.name}!</h3>
                  <p className="text-muted-foreground">What's happening in your world today? Share your thoughts with the community.</p>
                </div>
              </div>
            </div>

            {/* Enhanced Create Post Section */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm overflow-hidden">
              <CreatePostModalLauncher />
            </div>
            
            {/* Posts Feed */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <span className="text-sm font-medium text-muted-foreground">Latest Posts</span>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
              </div>
              
              <Suspense fallback={<GenericLoading />}>
                <Posts type="feed" userId={user.id} />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold mb-3 text-sm">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-background/50 hover:bg-muted/80 rounded-lg transition-all duration-200 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">🔥</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Trending</div>
                    <div className="text-xs text-muted-foreground">Coming soon</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-background/50 hover:bg-muted/80 rounded-lg transition-all duration-200 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">🏘️</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Communities</div>
                    <div className="text-xs text-muted-foreground">Coming soon</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-background/50 hover:bg-muted/80 rounded-lg transition-all duration-200 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">⚡</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Activity</div>
                    <div className="text-xs text-muted-foreground">Coming soon</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mini Profile Card */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Connected and active
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}