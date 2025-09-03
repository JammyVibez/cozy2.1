'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';

interface Theme {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  preview?: string;
  isOwned: boolean;
}

const categories = ['ALL', 'NEON', 'GAMING', 'MINIMAL', 'PROFESSIONAL', 'CLASSIC'];

export function ThemeMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: themesData, isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const response = await fetch('/api/monetization/themes');
      if (!response.ok) throw new Error('Failed to fetch themes');
      return response.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const response = await fetch('/api/monetization/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase theme');
      }
      
      return response.json();
    },
    onSuccess: (data, themeId) => {
      setSelectedTheme(null);
      showToast({ 
        title: 'Theme Purchased! 🎨', 
        message: 'Your new theme is now available',
        type: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
    onError: (error: Error) => {
      showToast({ 
        title: 'Error', 
        message: error.message, 
        type: 'error' 
      });
    },
  });

  const themes = themesData?.themes || [];
  const filteredThemes = themes.filter((theme: Theme) => 
    selectedCategory === 'ALL' || theme.category === selectedCategory
  );

  const handlePurchase = (theme: Theme) => {
    if (theme.price === 0) {
      // Free theme, just apply it
      showToast({ 
        title: 'Theme Applied! 🎨', 
        message: `${theme.name} is now active`,
        type: 'success' 
      });
      setSelectedTheme(null);
    } else {
      purchaseMutation.mutate(theme.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Theme Marketplace</h1>
        <p className="text-muted-foreground">
          Customize your Munia experience with beautiful themes
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme: Theme) => (
          <motion.div
            key={theme.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Theme Preview */}
            <div className="h-32 relative" style={{ backgroundColor: theme.colorScheme.background }}>
              <div className="absolute inset-0 p-4">
                <div 
                  className="w-full h-4 rounded-full mb-2" 
                  style={{ backgroundColor: theme.colorScheme.primary }}
                />
                <div 
                  className="w-2/3 h-3 rounded-full mb-2" 
                  style={{ backgroundColor: theme.colorScheme.secondary }}
                />
                <div 
                  className="w-1/2 h-3 rounded-full" 
                  style={{ backgroundColor: theme.colorScheme.accent }}
                />
              </div>
              {theme.isOwned && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Owned
                </div>
              )}
            </div>

            {/* Theme Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{theme.name}</h3>
                <span className="text-sm font-bold text-primary">
                  {theme.price === 0 ? 'Free' : `$${theme.price}`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {theme.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  onPress={() => setSelectedTheme(theme)}
                  mode="secondary"
                  size="small"
                  className="flex-1"
                >
                  Preview
                </Button>
                {!theme.isOwned && (
                  <Button
                    onPress={() => handlePurchase(theme)}
                    size="small"
                    className="flex-1"
                    loading={purchaseMutation.isPending}
                  >
                    {theme.price === 0 ? 'Apply' : 'Buy'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Theme Preview Modal */}
      <AnimatePresence>
        {selectedTheme && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTheme.name}</h2>
                    <p className="text-muted-foreground">{selectedTheme.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTheme(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                {/* Large Preview */}
                <div 
                  className="h-48 rounded-lg mb-6 relative"
                  style={{ backgroundColor: selectedTheme.colorScheme.background }}
                >
                  <div className="absolute inset-0 p-6">
                    <div 
                      className="w-full h-6 rounded-full mb-4" 
                      style={{ backgroundColor: selectedTheme.colorScheme.primary }}
                    />
                    <div 
                      className="w-3/4 h-4 rounded-full mb-3" 
                      style={{ backgroundColor: selectedTheme.colorScheme.secondary }}
                    />
                    <div 
                      className="w-1/2 h-4 rounded-full mb-3" 
                      style={{ backgroundColor: selectedTheme.colorScheme.accent }}
                    />
                    <div 
                      className="w-2/3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedTheme.colorScheme.primary }}
                    />
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Color Scheme</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(selectedTheme.colorScheme).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-xs capitalize">{name}</div>
                        <div className="text-xs text-muted-foreground">{color}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onPress={() => setSelectedTheme(null)}
                    mode="secondary"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {!selectedTheme.isOwned && (
                    <Button
                      onPress={() => handlePurchase(selectedTheme)}
                      loading={purchaseMutation.isPending}
                      className="flex-1"
                    >
                      {selectedTheme.price === 0 ? 'Apply Theme' : `Buy for $${selectedTheme.price}`}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}