'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { TextDesignShop } from './TextDesignShop';

interface CommunityCustomizationProps {
  communityId: string;
  isAdmin?: boolean;
  className?: string;
}

interface CommunityCosmetic {
  id: string;
  isActive: boolean;
  cosmetic: {
    id: string;
    type: string;
    name: string;
    preview: string;
    assetUrl: string;
  };
}

const CUSTOMIZATION_CATEGORIES = [
  { key: 'themes', label: 'Community Themes', icon: '🎨', description: 'Change the overall look and feel' },
  { key: 'post-skins', label: 'Post Skins', icon: '📝', description: 'Customize how posts appear' },
  { key: 'comment-flairs', label: 'Comment Flairs', icon: '💬', description: 'Special styling for comments' },
  { key: 'chat-themes', label: 'Chat Themes', icon: '💭', description: 'Chat room appearance' },
  { key: 'text-designs', label: 'Text Designs', icon: '✨', description: 'Rich text styling options' },
];

export function CommunityCustomization({ 
  communityId, 
  isAdmin = false, 
  className 
}: CommunityCustomizationProps) {
  const [activeCategory, setActiveCategory] = useState('themes');
  const [appliedCosmetics, setAppliedCosmetics] = useState<CommunityCosmetic[]>([]);
  const [availableCosmetics, setAvailableCosmetics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityCosmetics();
    fetchAvailableCosmetics();
  }, [communityId]);

  const fetchCommunityCosmetics = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/cosmetics`);
      if (response.ok) {
        const data = await response.json();
        setAppliedCosmetics(data.cosmetics || []);
      }
    } catch (error) {
      console.error('Error fetching community cosmetics:', error);
    }
  };

  const fetchAvailableCosmetics = async () => {
    try {
      const response = await fetch(`/api/cosmetics?category=${activeCategory}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableCosmetics(data.cosmetics || []);
      }
    } catch (error) {
      console.error('Error fetching available cosmetics:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCommunityCosmetic = async (cosmeticId: string, isActive: boolean) => {
    if (!isAdmin) return;
    
    setApplyingId(cosmeticId);
    try {
      const response = await fetch(`/api/communities/${communityId}/cosmetics/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cosmeticId, isActive }),
      });

      if (response.ok) {
        await fetchCommunityCosmetics();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to apply cosmetic');
      }
    } catch (error) {
      console.error('Error applying cosmetic:', error);
      alert('Failed to apply cosmetic');
    } finally {
      setApplyingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Admin Access Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Only community administrators can customize the appearance.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Community Customization
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your community's appearance with themes, skins, and text designs
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CUSTOMIZATION_CATEGORIES.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'p-4 rounded-lg border text-left transition-all hover:shadow-md',
                activeCategory === category.key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Cosmetics */}
      {appliedCosmetics.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Active Customizations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appliedCosmetics
              .filter(ac => ac.isActive)
              .map((applied) => (
                <div
                  key={applied.id}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        {applied.cosmetic.name}
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {applied.cosmetic.type.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => applyCommunityCosmetic(applied.cosmetic.id, false)}
                      disabled={applyingId === applied.cosmetic.id}
                      className="text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Content based on active category */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {activeCategory === 'text-designs' ? (
          <div className="p-6">
            <TextDesignShop className="border-0" />
          </div>
        ) : (
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : availableCosmetics.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {CUSTOMIZATION_CATEGORIES.find(c => c.key === activeCategory)?.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No {activeCategory.replace('-', ' ')} available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new customization options.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCosmetics.map((cosmetic) => {
                  const isApplied = appliedCosmetics.some(
                    ac => ac.cosmetic.id === cosmetic.id && ac.isActive
                  );
                  
                  return (
                    <motion.div
                      key={cosmetic.id}
                      whileHover={{ y: -2 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
                    >
                      {/* Preview */}
                      <div className="h-24 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                        {cosmetic.preview ? (
                          <img
                            src={cosmetic.preview}
                            alt={cosmetic.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-2xl">🎨</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {cosmetic.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {cosmetic.type.replace('_', ' ').toLowerCase()}
                        </p>

                        <button
                          onClick={() => applyCommunityCosmetic(cosmetic.id, !isApplied)}
                          disabled={applyingId === cosmetic.id}
                          className={cn(
                            'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                            isApplied
                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
                            applyingId === cosmetic.id && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {applyingId === cosmetic.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Applying...
                            </div>
                          ) : isApplied ? (
                            'Remove'
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}