'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function RealTimeNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${session.user.id}`);

    // Listen for various notification types
    channel.bind('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== data.id));
      }, 5000);
    });

    return () => {
      pusher.unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className="bg-background border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}