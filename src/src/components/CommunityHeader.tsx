'use client';

import React from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';

type Community = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  theme: string;
  avatar: string | null;
  banner: string | null;
  isPublic: boolean;
  isJoined: boolean;
  isCreator: boolean;
  userRole: string | null;
  creator: {
    id: string;
    name: string | null;
    username: string | null;
    profilePhoto: string | null;
  };
  _count: {
    members: number;
    posts: number;
  };
};

interface CommunityHeaderProps {
  community: Community;
}

const themeColors = {
  DEFAULT: 'from-blue-500 to-purple-600',
  DEVELOPER: 'from-green-400 to-blue-500',
  GAMER: 'from-purple-500 to-pink-500',
  CRYPTO: 'from-yellow-400 to-orange-500', 
  NEWS: 'from-gray-400 to-blue-500',
  CREATIVE: 'from-pink-400 to-red-500',
};

const categoryEmojis = {
  TECHNOLOGY: '💻',
  GAMING: '🎮',
  CRYPTOCURRENCY: '₿',
  NEWS: '📰',
  ENTERTAINMENT: '🎬',
  SPORTS: '⚽',
  EDUCATION: '📚',
  BUSINESS: '💼',
  LIFESTYLE: '✨',
  SCIENCE: '🔬',
  ART: '🎨',
  MUSIC: '🎵',
  OTHER: '🔗',
};

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/communities/${community.id}/join`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to join community');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', community.id] });
      showToast({ title: 'Successfully joined community!', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/communities/${community.id}/leave`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to leave community');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', community.id] });
      showToast({ title: 'Left community', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const themeClass = themeColors[community.theme as keyof typeof themeColors] || themeColors.DEFAULT;
  const categoryEmoji = categoryEmojis[community.category as keyof typeof categoryEmojis] || '🔗';

  return (
    <div className="rounded-xl bg-card border overflow-hidden">
      {/* Banner */}
      <div className={cn(
        'relative h-32 md:h-48 bg-gradient-to-r',
        themeClass
      )}>
        {community.banner ? (
          <Image
            src={community.banner}
            alt={`${community.name} banner`}
            fill
            className="object-cover"
          />
        ) : null}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          {categoryEmoji} {community.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Avatar */}
          <div className="relative -mt-16 md:-mt-20">
            {community.avatar ? (
              <Image
                src={community.avatar}
                alt={`${community.name} avatar`}
                width={96}
                height={96}
                className="rounded-xl border-4 border-background object-cover"
              />
            ) : (
              <div className={cn(
                'w-24 h-24 rounded-xl border-4 border-background bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl',
                themeClass
              )}>
                {community.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Community Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{community.name}</h1>
                {community.description && (
                  <p className="text-muted-foreground mt-2">{community.description}</p>
                )}
                
                {/* Stats */}
                <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                  <span>{community._count.members} members</span>
                  <span>{community._count.posts} posts</span>
                  <span>Created by @{community.creator.username}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {!community.isCreator && (
                  <Button
                    onPress={() => {
                      if (community.isJoined) {
                        leaveMutation.mutate();
                      } else {
                        joinMutation.mutate();
                      }
                    }}
                    loading={joinMutation.isPending || leaveMutation.isPending}
                    mode={community.isJoined ? 'secondary' : 'primary'}
                    className="min-w-[120px]"
                  >
                    {community.isJoined ? 'Leave' : 'Join Community'}
                  </Button>
                )}
                
                {(community.isCreator || community.userRole === 'ADMIN' || community.userRole === 'MODERATOR') && (
                  <Button mode="secondary">
                    Manage
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}