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
    <div className="group rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Main compose area */}
      <div className="p-4 sm:p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <ProfilePhotoOwn />
          </div>
          <div className="flex-1">
            <ButtonNaked 
              onPress={launcCreatePostFinderClosed} 
              className="w-full text-left p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <p className="text-muted-foreground">What's happening today? Share your thoughts...</p>
            </ButtonNaked>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <ButtonNaked
              onPress={launchCreatePostFinderOpened}
              className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              <SvgImage className="h-5 w-5" />
              <span>Media</span>
            </ButtonNaked>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all group relative"
              title="Poll feature coming soon"
            >
              <span className="text-lg">📊</span>
              <span>Poll</span>
              <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all group relative"
              title="Feeling feature coming soon"
            >
              <span className="text-lg">😊</span>
              <span>Feeling</span>
              <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Everyone can reply</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
