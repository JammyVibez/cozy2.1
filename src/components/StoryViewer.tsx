'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { Close, ArrowChevronBack, ArrowChevronForward } from '@/svg_components';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  expiresAt: string;
  viewers: number;
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewer({ stories, initialStoryIndex = 0, isOpen, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<NodeJS.Timeout>();
  
  const currentStory = stories[currentStoryIndex];
  const duration = 5000; // 5 seconds per story

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        goToNextStory();
      }
    }, 50);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStoryIndex, isOpen, isPaused]);

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') goToNextStory();
    if (e.key === 'ArrowLeft') goToPrevStory();
    if (e.key === ' ') {
      e.preventDefault();
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isPaused, currentStoryIndex]);

  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={onClose}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={cn(
                  'h-full bg-white transition-all duration-75',
                  index < currentStoryIndex ? 'w-full' : 
                  index === currentStoryIndex ? `w-[${progress}%]` : 'w-0'
                )}
                style={{
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-16 left-4 right-4 flex items-center gap-3 z-10">
          <Image
            src={currentStory.userAvatar || '/default-avatar.png'}
            alt={currentStory.userName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1">
            <p className="text-white font-medium">{currentStory.userName}</p>
            <p className="text-white/70 text-sm">
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>

        {/* Story content */}
        <div
          className="relative w-full max-w-md h-full max-h-[80vh] mx-4"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {currentStory.mediaType === 'image' ? (
            <Image
              src={currentStory.mediaUrl}
              alt="Story"
              fill
              className="object-contain rounded-lg"
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain rounded-lg"
              autoPlay
              muted
              onPause={() => setIsPaused(true)}
              onPlay={() => setIsPaused(false)}
            />
          )}

          {/* Navigation areas */}
          <button
            className="absolute left-0 top-0 w-1/3 h-full z-20 flex items-center justify-start pl-4"
            onClick={goToPrevStory}
            disabled={currentStoryIndex === 0}
          >
            {currentStoryIndex > 0 && (
              <ArrowChevronBack className="w-8 h-8 text-white/70 hover:text-white" />
            )}
          </button>

          <button
            className="absolute right-0 top-0 w-1/3 h-full z-20 flex items-center justify-end pr-4"
            onClick={goToNextStory}
          >
            <ArrowChevronForward className="w-8 h-8 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-black/50 rounded-full p-4">
              <div className="w-6 h-6 flex gap-1">
                <div className="w-2 bg-white rounded-full" />
                <div className="w-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}