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
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Feed
            </h1>
            <p className="text-sm text-muted-foreground">Stay connected with your community</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Live</span>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 space-y-6">
        {/* Welcome Banner - Only show occasionally */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
              👋
            </div>
            <div>
              <h3 className="font-semibold">Welcome back!</h3>
              <p className="text-sm text-muted-foreground">What's happening in your world today?</p>
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        <CreatePostModalLauncher />
        
        {/* Quick Actions Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors whitespace-nowrap group">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium">Trending</span>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors whitespace-nowrap group">
            <span className="text-lg">🏘️</span>
            <span className="text-sm font-medium">Communities</span>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors whitespace-nowrap group">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-medium">Activity</span>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors whitespace-nowrap group">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-medium">Apps</span>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-sm text-muted-foreground px-3">Latest Posts</span>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <Suspense fallback={<GenericLoading />}>
            <Posts type="feed" userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}