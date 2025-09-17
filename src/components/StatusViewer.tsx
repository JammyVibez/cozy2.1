
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useSession } from 'next-auth/react';

interface UserStatus {
  id: string;
  type: 'text' | 'mood' | 'activity';
  text?: string;
  mood?: string;
  activity?: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string | null;
  };
}

export function StatusViewer() {
  const [statuses, setStatuses] = useState<UserStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/status');
      if (response.ok) {
        const data = await response.json();
        setStatuses(data.statuses || []);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status: UserStatus) => {
    switch (status.type) {
      case 'mood':
        return {
          emoji: getMoodEmoji(status.mood),
          text: status.text || `Feeling ${status.mood}`
        };
      case 'activity':
        return {
          emoji: getActivityEmoji(status.activity),
          text: status.text || status.activity
        };
      default:
        return {
          emoji: '💭',
          text: status.text
        };
    }
  };

  const getMoodEmoji = (mood?: string) => {
    const moodMap: Record<string, string> = {
      'Happy': '😊',
      'Cool': '😎',
      'Thinking': '🤔',
      'Sleepy': '😴',
      'On Fire': '🔥',
      'Strong': '💪',
      'Loved': '❤️',
      'Celebrating': '🎉'
    };
    return moodMap[mood || ''] || '😊';
  };

  const getActivityEmoji = (activity?: string) => {
    const activityMap: Record<string, string> = {
      'Coding': '💻',
      'Gaming': '🎮',
      'Reading': '📚',
      'Listening to Music': '🎵',
      'Working Out': '🏃',
      'Having Coffee': '☕',
      'Eating': '🍕',
      'Traveling': '✈️'
    };
    return activityMap[activity || ''] || '🎯';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const statusTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - statusTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return statusTime.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-muted rounded-xl animate-pulse">
            <div className="w-12 h-12 bg-muted-foreground/20 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (statuses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-4xl mb-2">👋</div>
        <p>No status updates yet</p>
        <p className="text-sm">Be the first to share what you're up to!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {statuses.map((status) => {
          const display = getStatusDisplay(status);
          return (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-start gap-3 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {status.user.profilePhoto ? (
                  <img 
                    src={status.user.profilePhoto} 
                    alt={status.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  status.user.name.charAt(0)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{status.user.name}</span>
                  <span className="text-xs text-muted-foreground">@{status.user.username}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{getTimeAgo(status.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg">{display.emoji}</span>
                  <span className="text-sm">{display.text}</span>
                </div>
                
                {status.type !== 'text' && (
                  <div className="text-xs text-muted-foreground mt-1 capitalize">
                    {status.type} status
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
