import { Suspense } from 'react';
import { DiscordCustomization } from '@/components/DiscordCustomization';
import { GenericLoading } from '@/components/GenericLoading';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Cozy | Discord Customization',
  description: 'Customize your Discord integration, themes, and profile settings'
};

export default async function DiscordPage() {
  const [user] = await getServerUser();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access Discord customization.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              🎮
            </div>
            <div>
              <h1 className="text-3xl font-bold">Discord Customization</h1>
              <p className="text-muted-foreground">Personalize your Discord integration and themes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<GenericLoading />}>
        <DiscordCustomization userId={user.id} />
      </Suspense>
    </div>
  );
}