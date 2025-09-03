'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommunityCard } from './CommunityCard';
import { CommunityFilter } from './CommunityFilter';
import { GenericLoading } from './GenericLoading';
import { SomethingWentWrong } from './SometingWentWrong';

type Community = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  theme: string;
  avatar: string | null;
  banner: string | null;
  isPublic: boolean;
  memberCount: number;
  isJoined: boolean;
  creator: {
    name: string;
    username: string;
  };
};

export function CommunityDiscovery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'members'>('trending');

  const { data: communities, isPending, isError, error } = useQuery<Community[]>({
    queryKey: ['communities', selectedCategory, searchQuery, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        sortBy,
      });
      
      const response = await fetch(`/api/communities?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isPending) {
    return <GenericLoading />;
  }

  if (isError) {
    return <SomethingWentWrong />;
  }

  return (
    <div className="space-y-6">
      <CommunityFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Featured/Trending Section */}
      {sortBy === 'trending' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            🔥 Trending Communities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities?.slice(0, 6).map((community) => (
              <CommunityCard key={community.id} community={community} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Communities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedCategory === 'ALL' ? 'All Communities' : `${selectedCategory} Communities`}
          </h2>
          <span className="text-sm text-muted-foreground">
            {communities?.length || 0} communities found
          </span>
        </div>

        {communities && communities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No communities found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `Try searching for something else or browse different categories.`
                : `Be the first to create a community in this category!`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities?.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}