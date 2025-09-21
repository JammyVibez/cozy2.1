'use client';

import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { useCallback } from 'react';
import { ButtonNaked } from './ui/ButtonNaked';

export function FloatingPostButton() {
  const { launchCreatePost } = useCreatePostModal();
  
  const handleQuickPost = useCallback(() => {
    launchCreatePost({});
  }, [launchCreatePost]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ButtonNaked
        onPress={handleQuickPost}
        className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <svg 
          className="w-6 h-6 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </ButtonNaked>
    </div>
  );
}
