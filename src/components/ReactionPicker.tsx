'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ReactionPickerProps {
  onReactionSelect: (reaction: string) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const reactions = [
  { emoji: '❤️', name: 'love', color: 'text-red-500' },
  { emoji: '😂', name: 'laugh', color: 'text-yellow-500' },
  { emoji: '😮', name: 'wow', color: 'text-blue-500' },
  { emoji: '😢', name: 'sad', color: 'text-blue-400' },
  { emoji: '😡', name: 'angry', color: 'text-red-600' },
  { emoji: '👍', name: 'like', color: 'text-green-500' },
];

export function ReactionPicker({ onReactionSelect, isOpen, onClose, className }: ReactionPickerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />
          
          {/* Reaction picker */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={cn(
              'absolute z-50 bg-white dark:bg-gray-800 rounded-full shadow-lg border p-2 flex gap-1',
              className
            )}
          >
            {reactions.map((reaction, index) => (
              <motion.button
                key={reaction.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onReactionSelect(reaction.name);
                  onClose();
                }}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  reaction.color
                )}
                title={reaction.name}
              >
                {reaction.emoji}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for managing reactions
export function useReactions(postId: string, commentId?: string) {
  const [showPicker, setShowPicker] = useState(false);
  
  const addReaction = async (reaction: string) => {
    try {
      const endpoint = commentId 
        ? `/api/comments/${commentId}/reactions`
        : `/api/posts/${postId}/reactions`;
        
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const removeReaction = async (reaction: string) => {
    try {
      const endpoint = commentId 
        ? `/api/comments/${commentId}/reactions`
        : `/api/posts/${postId}/reactions`;
        
      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  return {
    showPicker,
    setShowPicker,
    addReaction,
    removeReaction,
  };
}