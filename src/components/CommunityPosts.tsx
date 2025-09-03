'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/cn';
import { GenericLoading } from './GenericLoading';
import { SomethingWentWrong } from './SometingWentWrong';
import { Post } from './Post';
import Button from './ui/Button';

interface CommunityPostsProps {
  communityId: string;
  zones?: Array<{
    id: string;
    name: string;
    emoji?: string;
  }>;
}

export function CommunityPosts({ communityId, zones = [] }: CommunityPostsProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<{ [key: number]: boolean }>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['community-posts', communityId, selectedZone],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: '10',
        ...(selectedZone && { zoneId: selectedZone }),
      });
      
      const response = await fetch(`/api/communities/${communityId}/posts?${params}`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You must be a member to view community posts');
        }
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
  });

  const toggleComments = (postId: number) => {
    setVisiblePosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (isLoading) return <GenericLoading />;
  if (error) return <SomethingWentWrong />;

  const posts = data || [];

  return (
    <div className="space-y-6">
      {/* Create Post Section for Community Members */}
      <div className="bg-card border rounded-xl p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">✏️</div>
          <h3 className="text-lg font-medium mb-2">Share with the Community</h3>
          <p className="text-muted-foreground mb-4">
            Post creation in communities is coming soon! For now, you can create posts in the main feed.
          </p>
          <Button mode="secondary" size="small">
            Create Post (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Zone Filter */}
      {zones.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Zone</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedZone(null)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm',
                selectedZone === null
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-input'
              )}
            >
              📝 All Zones
            </button>
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm',
                  selectedZone === zone.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-input'
                )}
              >
                {zone.emoji && <span>{zone.emoji}</span>}
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">
            {selectedZone ? 'No Posts in This Zone' : 'No Community Posts Yet'}
          </h3>
          <p className="text-muted-foreground">
            {selectedZone 
              ? 'This zone doesn\'t have any posts yet. Try selecting a different zone.'
              : 'Be the first to share something with this community!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <Post
              key={post.id}
              id={post.id}
              commentsShown={!!visiblePosts[post.id]}
              toggleComments={toggleComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}