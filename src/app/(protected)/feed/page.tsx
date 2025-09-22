import { Suspense } from 'react';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { Posts } from '@/components/Posts';
import { GenericLoading } from '@/components/GenericLoading';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { FeedFilters } from '@/components/FeedFilters';
import { FloatingPostButton } from '@/components/FloatingPostButton';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Cozy | Feed',
};

export default async function Page() {
  const [user] = await getServerUser();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access your feed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Home</h1>
              <p className="text-sm text-muted-foreground">Your personalized feed</p>
              </div>
              <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          
          {/* Create Post Section */}
          <div className="bg-card border border-border/50 rounded-xl shadow-sm">
            <CreatePostModalLauncher />
          </div>
          
          {/* Feed Filters */}
          <FeedFilters />
            
            {/* Posts Feed */}
              <Suspense fallback={<GenericLoading />}>
                <Posts type="feed" userId={user.id} />
              </Suspense>
            </div>
          </div>

      {/* Floating Post Button */}
      <FloatingPostButton />
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}