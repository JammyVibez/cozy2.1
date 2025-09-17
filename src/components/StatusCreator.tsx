
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { useSession } from 'next-auth/react';

interface StatusCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatusCreator({ isOpen, onClose }: StatusCreatorProps) {
  const [statusText, setStatusText] = useState('');
  const [statusType, setStatusType] = useState<'text' | 'mood' | 'activity'>('text');
  const [mood, setMood] = useState('');
  const [activity, setActivity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { showToast } = useToast();

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😎', label: 'Cool' },
    { emoji: '🤔', label: 'Thinking' },
    { emoji: '😴', label: 'Sleepy' },
    { emoji: '🔥', label: 'On Fire' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '❤️', label: 'Loved' },
    { emoji: '🎉', label: 'Celebrating' }
  ];

  const activities = [
    { emoji: '💻', label: 'Coding' },
    { emoji: '🎮', label: 'Gaming' },
    { emoji: '📚', label: 'Reading' },
    { emoji: '🎵', label: 'Listening to Music' },
    { emoji: '🏃', label: 'Working Out' },
    { emoji: '☕', label: 'Having Coffee' },
    { emoji: '🍕', label: 'Eating' },
    { emoji: '✈️', label: 'Traveling' }
  ];

  const handleCreateStatus = async () => {
    if (!statusText.trim() && statusType === 'text') return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: statusType,
          text: statusText,
          mood: statusType === 'mood' ? mood : null,
          activity: statusType === 'activity' ? activity : null,
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        })
      });

      if (response.ok) {
        showToast({
          title: 'Status Updated',
          message: 'Your status has been posted successfully!',
          type: 'success'
        });
        setStatusText('');
        setMood('');
        setActivity('');
        onClose();
      } else {
        throw new Error('Failed to create status');
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to update status',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-card border rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Update Status</h3>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Status Type Selector */}
              <div className="flex gap-2">
                {[
                  { type: 'text', label: 'Text', icon: '💬' },
                  { type: 'mood', label: 'Mood', icon: '😊' },
                  { type: 'activity', label: 'Activity', icon: '🎯' }
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setStatusType(option.type as any)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      statusType === option.type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted-foreground/10'
                    )}
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Content Input */}
              {statusType === 'text' && (
                <textarea
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 bg-muted rounded-lg resize-none h-20 text-sm border-none outline-none"
                  maxLength={200}
                />
              )}

              {statusType === 'mood' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="Describe your mood..."
                    className="w-full p-3 bg-muted rounded-lg text-sm border-none outline-none"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {moods.map((moodOption) => (
                      <button
                        key={moodOption.label}
                        onClick={() => setMood(moodOption.label)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors',
                          mood === moodOption.label
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted-foreground/10'
                        )}
                      >
                        <span className="text-lg">{moodOption.emoji}</span>
                        {moodOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {statusType === 'activity' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="Add details about what you're doing..."
                    className="w-full p-3 bg-muted rounded-lg text-sm border-none outline-none"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {activities.map((activityOption) => (
                      <button
                        key={activityOption.label}
                        onClick={() => setActivity(activityOption.label)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors',
                          activity === activityOption.label
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted-foreground/10'
                        )}
                      >
                        <span className="text-lg">{activityOption.emoji}</span>
                        {activityOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Character Count */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Status expires in 24 hours</span>
                <span>{statusText.length}/200</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-muted-foreground/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStatus}
                  disabled={isLoading || (!statusText.trim() && statusType === 'text')}
                  className={cn(
                    'flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90'
                  )}
                >
                  {isLoading ? 'Posting...' : 'Post Status'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
