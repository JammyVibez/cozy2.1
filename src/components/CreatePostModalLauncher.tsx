'use client';

import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import SvgImage from '@/svg_components/Image';
import { useCallback } from 'react';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { ButtonNaked } from './ui/ButtonNaked';

export function CreatePostModalLauncher() {
  const { launchCreatePost } = useCreatePostModal();
  const launcCreatePostFinderClosed = useCallback(() => launchCreatePost({}), [launchCreatePost]);
  const launchCreatePostFinderOpened = useCallback(() => {
    launchCreatePost({
      shouldOpenFileInputOnMount: true,
    });
  }, [launchCreatePost]);

  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <ProfilePhotoOwn />
          </div>
          <div className="flex-1">
            <ButtonNaked 
              onPress={launcCreatePostFinderClosed} 
              className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/50"
            >
              <p className="text-muted-foreground">What's happening?</p>
            </ButtonNaked>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
          <div className="flex gap-1">
            <ButtonNaked
              onPress={launchCreatePostFinderOpened}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              <SvgImage className="h-4 w-4" />
              <span>Media</span>
            </ButtonNaked>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Poll feature coming soon"
            >
              <span className="text-sm">📊</span>
              <span>Poll</span>
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Feeling feature coming soon"
            >
              <span className="text-sm">😊</span>
              <span>Feeling</span>
            </button>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Everyone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
