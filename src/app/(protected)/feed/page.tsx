import { Suspense } from 'react';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { Posts } from '@/components/Posts';
import { CreatePostSort } from '@/components/CreatePostSort';
import { GenericLoading } from '@/components/GenericLoading';
import { StatusViewer } from '@/components/StatusViewer';
import { StatusCreator } from '@/components/StatusCreator';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Cozy | Feed',
};

export default async function Page() {
  const [user] = await getServerUser();
  return (
    <div className="px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Feed</h1>
        <div>
          <ThemeSwitch />
        </div>
      </div>

      {/* Status Section */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Status Updates</h2>
          <span className="text-sm text-muted-foreground">24h</span>
        </div>
        <StatusCreator />
        <div className="mt-6">
          <StatusViewer />
        </div>
      </div>

      {/* Community Features Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🚀</span>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">New Community Features!</h3>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Create communities, join events, and connect with like-minded people!
        </p>
        <div className="flex gap-2">
          <a href="/communities/create" className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Community
          </a>
          <a href="/communities" className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
            Explore
          </a>
        </div>
      </div>

      <CreatePostModalLauncher />
      <CreatePostSort />
      <Suspense fallback={<GenericLoading />}>
        <Posts type="feed" userId={user.id} />
      </Suspense>
    </div>
  );
}