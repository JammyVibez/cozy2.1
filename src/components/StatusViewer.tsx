
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis: { [key: string]: string } = {
      'Happy': '😊',
      'Cool': '😎',
      'Thinking': '🤔',
      'Sleepy': '😴',
      'On Fire': '🔥',
      'Strong': '💪',
      'Loved': '❤️',
      'Celebrating': '🎉'
    };
    return moodEmojis[mood || ''] || '😊';
  };

  const getActivityEmoji = (activity?: string) => {
    const activityEmojis: { [key: string]: string } = {
      'Coding': '💻',
      'Gaming': '🎮',
      'Reading': '📚',
      'Listening to Music': '🎵',
      'Working Out': '🏃',
      'Having Coffee': '☕',
      'Eating': '🍕',
      'Traveling': '✈️'
    };
    return activityEmojis[activity || ''] || '🎯';
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

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (statuses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">💭</div>
        <p className="text-sm text-muted-foreground">No status updates yet. Be the first to share what you're up to!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      <AnimatePresence>
        {statuses.map((status) => {
          const display = getStatusDisplay(status);
          return (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
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
                  <span className="font-medium text-xs">{status.user.name}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{getTimeAgo(status.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">{display.emoji}</span>
                  <span className="text-xs">{display.text}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
