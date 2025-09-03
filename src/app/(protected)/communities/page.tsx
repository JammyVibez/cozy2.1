import { CommunityDiscovery } from '@/components/CommunityDiscovery';
import { CreateCommunityButton } from '@/components/CreateCommunityButton';

export const metadata = {
  title: 'Communities - Discover Your Tribe',
  description: 'Find and join communities that match your interests on Cozy',
};

export default function CommunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discover Communities</h1>
          <p className="mt-2 text-muted-foreground">
            Find your tribe and connect with people who share your passions
          </p>
        </div>
        <CreateCommunityButton />
      </div>
      
      <CommunityDiscovery />
    </div>
  );
}