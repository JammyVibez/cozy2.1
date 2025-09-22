'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';
import { TextInput } from './ui/TextInput';
import { Textarea } from './ui/Textarea';
import Close from '@/svg_components/Close';

interface EditThemeModalProps {
  theme: {
    id: string;
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'CLASSIC', label: 'Classic', description: 'Timeless and elegant designs' },
  { value: 'NEON', label: 'Neon', description: 'Bright cyberpunk-inspired themes' },
  { value: 'MINIMAL', label: 'Minimal', description: 'Clean and simple aesthetics' },
  { value: 'GAMING', label: 'Gaming', description: 'Dynamic themes for gamers' },
  { value: 'PROFESSIONAL', label: 'Professional', description: 'Sophisticated business themes' },
];

export function EditThemeModal({ theme, isOpen, onClose }: EditThemeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [colorScheme, setColorScheme] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    accent: '#f1f5f9'
  });
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Load theme data when modal opens
  useEffect(() => {
    if (theme && isOpen) {
      setName(theme.name);
      setDescription(theme.description);
      setCategory(theme.category);
      setPrice(theme.price.toString());
      setColorScheme(theme.colorScheme);
    }
  }, [theme, isOpen]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!theme) throw new Error('No theme selected');
      
      const response = await fetch(`/api/admin/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update theme');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] });
      showToast({ 
        title: 'Theme Updated! ✨', 
        message: `${data.theme.name} has been updated successfully`,
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
    
    if (!name.trim() || !description.trim() || !category || !price) {
      showToast({ 
        title: 'Error', 
        message: 'Please fill in all required fields', 
        type: 'error' 
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      showToast({ 
        title: 'Error', 
        message: 'Please enter a valid price', 
        type: 'error' 
      });
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      category,
      price: priceValue,
      colorScheme,
    });
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen || !theme) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Theme</h2>
          <button
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Theme Name */}
          <div>
            <TextInput
              label="Theme Name *"
              value={name}
              onChange={setName}
              placeholder="Enter theme name"
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Description *"
              value={description}
              onChange={setDescription}
              placeholder="Describe your theme..."
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-3">Category *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.value}>
                  <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={category === cat.value}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-sm text-muted-foreground">{cat.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <TextInput
              label="Price (USD) *"
              type="number"
              value={price}
              onChange={setPrice}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <p className="text-sm text-muted-foreground mt-1">Set to 0 for free themes</p>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-sm font-medium mb-3">Color Scheme</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorScheme.primary}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, primary: e.target.value }))}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorScheme.primary}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, primary: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorScheme.secondary}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, secondary: e.target.value }))}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorScheme.secondary}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, secondary: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="#64748b"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorScheme.background}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, background: e.target.value }))}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorScheme.background}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, background: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorScheme.accent}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorScheme.accent}
                    onChange={(e) => setColorScheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="#f1f5f9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Preview */}
          <div>
            <label className="block text-sm font-medium mb-3">Preview</label>
            <div 
              className="h-32 rounded-lg p-4 border"
              style={{ 
                backgroundColor: colorScheme.background,
                color: colorScheme.primary,
              }}
            >
              <div 
                className="w-full h-4 rounded-full mb-2" 
                style={{ backgroundColor: colorScheme.primary }}
              />
              <div 
                className="w-2/3 h-3 rounded-full mb-2" 
                style={{ backgroundColor: colorScheme.secondary }}
              />
              <div 
                className="w-1/2 h-3 rounded-full" 
                style={{ backgroundColor: colorScheme.accent }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              mode="secondary"
              onPress={handleClose}
              className="flex-1"
              isDisabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={updateMutation.isPending}
            >
              Update Theme
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}