'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';

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

interface CommunityCardProps {
  community: Community;
  featured?: boolean;
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

export function CommunityCard({ community, featured = false }: CommunityCardProps) {
  const [isJoining, setIsJoining] = useState(false);
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
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      showToast({ title: 'Successfully joined community!', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
    onSettled: () => {
      setIsJoining(false);
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
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      showToast({ title: 'Left community', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
    onSettled: () => {
      setIsJoining(false);
    },
  });

  const handleJoinToggle = () => {
    setIsJoining(true);
    if (community.isJoined) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  const themeClass = themeColors[community.theme as keyof typeof themeColors] || themeColors.DEFAULT;
  const categoryEmoji = categoryEmojis[community.category as keyof typeof categoryEmojis] || '🔗';

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-xl bg-card border transition-all duration-200 hover:shadow-lg',
      featured && 'ring-2 ring-primary/20 shadow-md'
    )}>
      {/* Banner/Background */}
      <div className={cn(
        'relative h-24 bg-gradient-to-r',
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
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
          {categoryEmoji} {community.category}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Community Avatar & Info */}
        <div className="flex items-start gap-3">
          <div className="relative">
            {community.avatar ? (
              <Image
                src={community.avatar}
                alt={`${community.name} avatar`}
                width={48}
                height={48}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className={cn(
                'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold',
                themeClass
              )}>
                {community.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            {featured && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs">🔥</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/communities/${community.id}`}
              className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {community.name}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {community.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{community.memberCount} members</span>
          <span>by @{community.creator.username}</span>
        </div>

        {/* Join/Leave Button */}
        <button
          onClick={handleJoinToggle}
          disabled={isJoining}
          className={cn(
            'w-full py-2 px-4 rounded-lg font-medium transition-colors',
            community.isJoined
              ? 'bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
            isJoining && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isJoining ? (
            'Loading...'
          ) : community.isJoined ? (
            'Leave Community'
          ) : (
            'Join Community'
          )}
        </button>
      </div>
    </div>
  );
}