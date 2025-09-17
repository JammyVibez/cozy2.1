import { Suspense } from 'react';
import { IntegrationsManagement } from '@/components/IntegrationsManagement';
import { GenericLoading } from '@/components/GenericLoading';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Cozy | Integrations',
  description: 'Connect and manage your external app integrations'
};

export default async function IntegrationsPage() {
  const [user] = await getServerUser();
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
              🔗
            </div>
            <div>
              <h1 className="text-3xl font-bold">App Integrations</h1>
              <p className="text-muted-foreground">Connect your favorite apps and services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Suspense fallback={<GenericLoading />}>
          <IntegrationsManagement userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}