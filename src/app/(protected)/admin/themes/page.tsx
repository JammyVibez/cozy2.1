'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/Modal';
import { generateThemePreview } from '@/lib/themes/themeUtils';
import { themeDefinitions } from '@/lib/themes/themeDefinitions';

interface AdminTheme {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  usage: number;
  revenue: number;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateThemeData {
  name: string;
  description: string;
  category: string;
  price: number;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
}

export default function AdminThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<AdminTheme | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<AdminTheme | null>(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'revenue' | 'created'>('usage');

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Fetch themes data
  const { data: themesData, isLoading } = useQuery({
    queryKey: ['admin-themes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/themes');
      if (!response.ok) throw new Error('Failed to fetch themes');
      return response.json();
    },
  });

  const themes: AdminTheme[] = themesData?.themes || [];

  // Filter and sort themes
  const filteredThemes = themes
    .filter(theme => filterCategory === 'ALL' || theme.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'usage': return b.usage - a.usage;
        case 'revenue': return b.revenue - a.revenue;
        case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  // Toggle theme active status
  const toggleThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const response = await fetch(`/api/admin/themes/${themeId}/toggle`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle theme');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] });
      showToast({ title: 'Theme updated successfully', type: 'success' });
    },
  });

  // Delete theme
  const deleteThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const response = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete theme');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] });
      showToast({ title: 'Theme deleted successfully', type: 'success' });
      setSelectedTheme(null);
    },
  });

  const categories = ['ALL', 'NEON', 'GAMING', 'MINIMAL', 'PROFESSIONAL', 'CLASSIC', 'FANTASY', 'NATURE'];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Theme Management</h1>
              <p className="text-muted-foreground">
                Manage marketplace themes, analyze usage, and create new themes
              </p>
            </div>
            <Button onPress={() => setShowCreateModal(true)}>
              Create New Theme
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎨</span>
              <h3 className="font-semibold">Total Themes</h3>
            </div>
            <div className="text-2xl font-bold">{themes.length}</div>
            <p className="text-sm text-muted-foreground">
              {themes.filter(t => t.isActive).length} active
            </p>
          </div>
          
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👥</span>
              <h3 className="font-semibold">Total Usage</h3>
            </div>
            <div className="text-2xl font-bold">
              {themes.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Active installations</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💰</span>
              <h3 className="font-semibold">Total Revenue</h3>
            </div>
            <div className="text-2xl font-bold">
              ${themes.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">From theme sales</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⭐</span>
              <h3 className="font-semibold">Popular Theme</h3>
            </div>
            <div className="text-lg font-bold">
              {themes.sort((a, b) => b.usage - a.usage)[0]?.name || 'None'}
            </div>
            <p className="text-sm text-muted-foreground">Most used theme</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="usage">Usage</option>
              <option value="revenue">Revenue</option>
              <option value="name">Name</option>
              <option value="created">Created Date</option>
            </select>
          </div>
        </div>

        {/* Themes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <motion.div
                key={theme.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedTheme(theme)}
              >
                {/* Theme Preview */}
                <div className="h-32 relative rounded-t-xl overflow-hidden" 
                     style={{ backgroundColor: theme.colorScheme.background }}>
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
                  
                  {/* Status badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!theme.isActive && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                    {theme.price === 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{theme.name}</h3>
                    <span className="text-sm font-bold text-primary">
                      ${theme.price}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {theme.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Usage: {theme.usage.toLocaleString()}</div>
                    <div>Revenue: ${theme.revenue.toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Theme Details Modal */}
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

                  {/* Analytics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{selectedTheme.usage}</div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">${selectedTheme.revenue}</div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onPress={() => {
                        setEditingTheme(selectedTheme);
                        setShowEditModal(true);
                      }}
                      mode="secondary"
                    >
                      Edit Theme
                    </Button>
                    
                    <Button
                      onPress={() => toggleThemeMutation.mutate(selectedTheme.id)}
                      loading={toggleThemeMutation.isPending}
                      mode={selectedTheme.isActive ? "secondary" : "primary"}
                    >
                      {selectedTheme.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button
                      onPress={() => deleteThemeMutation.mutate(selectedTheme.id)}
                      loading={deleteThemeMutation.isPending}
                      mode="secondary"
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}