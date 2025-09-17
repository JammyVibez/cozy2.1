
import { CommunityDiscovery } from '@/components/CommunityDiscovery';
import { CreateCommunityButton } from '@/components/CreateCommunityButton';

export const metadata = {
  title: 'Communities - Munia',
  description: 'Discover and join communities',
};

export default function CommunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">
            Discover communities that match your interests
          </p>
        </div>
        <CreateCommunityButton />
      </div>
      
      <CommunityDiscovery />
    </div>
  );
}
