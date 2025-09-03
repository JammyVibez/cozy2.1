'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';
import { useToast } from '@/hooks/useToast';
import { NotificationBell } from '@/svg_components';

interface NotificationData {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  fromUser: {
    name: string;
    username: string;
    profilePhoto: string | null;
  };
  targetId?: string;
}

export function RealTimeNotifications() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${session.user.id}`);

    // Listen for new notifications
    channel.bind('new-notification', (data: NotificationData) => {
      showToast({
        title: 'New Notification',
        message: data.message,
        type: 'default',
      });
    });

    // Listen for live likes
    channel.bind('post-liked', (data: { postId: string; userId: string; userName: string }) => {
      // You can update the UI in real-time here
      const event = new CustomEvent('postLiked', { detail: data });
      window.dispatchEvent(event);
    });

    // Listen for live comments
    channel.bind('new-comment', (data: { postId: string; comment: any }) => {
      const event = new CustomEvent('newComment', { detail: data });
      window.dispatchEvent(event);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id, showToast]);

  return null; // This component doesn't render anything
}

// Hook for subscribing to post-specific updates
export function usePostUpdates(postId: string) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!postId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`post-${postId}`);

    // Listen for typing indicators in comments
    channel.bind('user-typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      const event = new CustomEvent('userTyping', { detail: { ...data, postId } });
      window.dispatchEvent(event);
    });

    // Listen for live reaction updates
    channel.bind('reaction-added', (data: { userId: string; reaction: string }) => {
      const event = new CustomEvent('reactionAdded', { detail: { ...data, postId } });
      window.dispatchEvent(event);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`post-${postId}`);
    };
  }, [postId]);
}