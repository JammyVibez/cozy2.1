
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const pusherClient = getPusherClient();
    const channel = pusherClient.subscribe(`user-${session.user.id}`);

    channel.bind('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev.slice(0, 4)]);
      setIsVisible(true);

      // Auto hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    });

    return () => {
      getPusherClient().unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  return (
    <AnimatePresence>
      {isVisible && notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 space-y-2"
        >
          {notifications.slice(0, 3).map((notification) => (
            <motion.div
              key={notification.id}
              className="bg-card border rounded-lg p-4 shadow-lg max-w-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
