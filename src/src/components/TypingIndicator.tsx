'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';
import { cn } from '@/lib/cn';

interface TypingIndicatorProps {
  postId: string;
  className?: string;
}

interface TypingUser {
  userId: string;
  userName: string;
}

export function TypingIndicator({ postId, className }: TypingIndicatorProps) {
  const { data: session } = useSession();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    const handleUserTyping = (event: CustomEvent) => {
      const { userId, userName, isTyping, postId: eventPostId } = event.detail;
      
      if (eventPostId !== postId || userId === session?.user?.id) return;

      setTypingUsers(prev => {
        if (isTyping) {
          // Add user if not already in the list
          if (!prev.find(user => user.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        } else {
          // Remove user from typing list
          return prev.filter(user => user.userId !== userId);
        }
      });
    };

    window.addEventListener('userTyping', handleUserTyping as EventListener);

    return () => {
      window.removeEventListener('userTyping', handleUserTyping as EventListener);
    };
  }, [postId, session?.user?.id]);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    } else {
      return `${typingUsers[0].userName} and ${typingUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground italic',
      className
    )}>
      <div className="flex gap-1">
        {/* Typing animation dots */}
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
}

// Hook for sending typing indicators
export function useTypingIndicator(postId: string) {
  const { data: session } = useSession();
  let typingTimeout: NodeJS.Timeout;

  const sendTypingIndicator = async (isTyping: boolean) => {
    if (!session?.user?.id || !postId) return;

    try {
      await fetch('/api/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: session.user.id,
          userName: session.user.name,
          isTyping,
        }),
      });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  const startTyping = () => {
    sendTypingIndicator(true);
    
    // Clear any existing timeout
    clearTimeout(typingTimeout);
    
    // Stop typing after 3 seconds of inactivity
    typingTimeout = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeout);
    sendTypingIndicator(false);
  };

  return { startTyping, stopTyping };
}