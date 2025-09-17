
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher/pusherClientSide';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  user: {
    name: string;
    username: string;
    profilePhoto: string | null;
  };
  createdAt: string;
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`user-${session.user.id}`);
    
    channel.bind('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev.slice(0, 4)]);
      setIsVisible(true);
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    });

    return () => {
      pusherClient.unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="bg-card border rounded-lg p-4 shadow-lg max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {notification.user.profilePhoto ? (
                  <img 
                    src={notification.user.profilePhoto} 
                    alt={notification.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  notification.user.name.charAt(0)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {notification.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Just now
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {notification.type === 'like' && <span className="text-red-500">❤️</span>}
                {notification.type === 'comment' && <span className="text-blue-500">💬</span>}
                {notification.type === 'follow' && <span className="text-green-500">👥</span>}
                {notification.type === 'mention' && <span className="text-purple-500">@</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
