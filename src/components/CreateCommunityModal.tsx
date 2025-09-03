'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';
import { Close } from '@/svg_components';

interface CreateCommunityModalProps {
  onClose: () => void;
}

const categories = [
  { value: 'TECHNOLOGY', label: 'Technology', emoji: '💻' },
  { value: 'GAMING', label: 'Gaming', emoji: '🎮' },
  { value: 'CRYPTOCURRENCY', label: 'Crypto', emoji: '₿' },
  { value: 'NEWS', label: 'News', emoji: '📰' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', emoji: '🎬' },
  { value: 'SPORTS', label: 'Sports', emoji: '⚽' },
  { value: 'EDUCATION', label: 'Education', emoji: '📚' },
  { value: 'BUSINESS', label: 'Business', emoji: '💼' },
  { value: 'LIFESTYLE', label: 'Lifestyle', emoji: '✨' },
  { value: 'SCIENCE', label: 'Science', emoji: '🔬' },
  { value: 'ART', label: 'Art', emoji: '🎨' },
  { value: 'MUSIC', label: 'Music', emoji: '🎵' },
  { value: 'OTHER', label: 'Other', emoji: '🔗' },
];

const themes = [
  { value: 'DEFAULT', label: 'Default', description: 'Clean and modern' },
  { value: 'DEVELOPER', label: 'Developer', description: 'Dark neon theme' },
  { value: 'GAMER', label: 'Gaming', description: 'Gaming inspired' },
  { value: 'CRYPTO', label: 'Crypto', description: 'Financial/trading theme' },
  { value: 'NEWS', label: 'News', description: 'Clean news style' },
  { value: 'CREATIVE', label: 'Creative', description: 'Artistic and colorful' },
];

export function CreateCommunityModal({ onClose }: CreateCommunityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('DEFAULT');
  const [isPublic, setIsPublic] = useState(true);
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/communities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create community');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      showToast({ 
        title: 'Community Created!', 
        message: `${data.community.name} is ready for members`,
        type: 'success' 
      });
      onClose();
    },
    onError: (error: Error) => {
      showToast({ 
        title: 'Error', 
        message: error.message, 
        type: 'error' 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category) {
      showToast({ 
        title: 'Error', 
        message: 'Please fill in all required fields', 
        type: 'error' 
      });
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || null,
      category,
      theme,
      isPublic,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Create Community</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Community Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Community Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name..."
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your community about?"
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {description.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border transition-colors text-left',
                    category === cat.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted border-input'
                  )}
                >
                  <span>{cat.emoji}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  type="button"
                  onClick={() => setTheme(themeOption.value)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-colors',
                    theme === themeOption.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted border-input'
                  )}
                >
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {themeOption.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Privacy
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-colors',
                  isPublic
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-input'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌍</span>
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-sm opacity-80">
                      Anyone can discover and join this community
                    </div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-colors',
                  !isPublic
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-input'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔒</span>
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-sm opacity-80">
                      Only invited members can join
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onPress={onClose}
              mode="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending}
              className="flex-1"
            >
              Create Community
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}