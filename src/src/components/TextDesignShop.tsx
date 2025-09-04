'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TextDesignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isFree: boolean;
  preview: string;
  styles: any;
  iframeUrl?: string;
  isPurchased: boolean;
}

interface TextDesignShopProps {
  onSelectTemplate?: (template: TextDesignTemplate) => void;
  className?: string;
}

const CATEGORIES = [
  { key: 'ALL', label: 'All Templates', icon: '🎨' },
  { key: 'CLASSIC', label: 'Classic', icon: '📝' },
  { key: 'MODERN', label: 'Modern', icon: '✨' },
  { key: 'NEON', label: 'Neon', icon: '💡' },
  { key: 'GAMING', label: 'Gaming', icon: '🎮' },
  { key: 'PROFESSIONAL', label: 'Professional', icon: '💼' },
  { key: 'ARTISTIC', label: 'Artistic', icon: '🎭' },
  { key: 'ANIMATED', label: 'Animated', icon: '⚡' },
  { key: 'GRADIENT', label: 'Gradient', icon: '🌈' },
];

export function TextDesignShop({ onSelectTemplate, className }: TextDesignShopProps) {
  const [templates, setTemplates] = useState<TextDesignTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TextDesignTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(t => t.category === selectedCategory));
    }
  }, [templates, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/text-design');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (templateId: string) => {
    setPurchasingId(templateId);
    try {
      const response = await fetch('/api/text-design/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update template as purchased
        setTemplates(prev => prev.map(t => 
          t.id === templateId ? { ...t, isPurchased: true } : t
        ));
        
        // Show success message
        alert(data.message);
      } else {
        alert(data.error || 'Failed to purchase template');
      }
    } catch (error) {
      console.error('Error purchasing template:', error);
      alert('Failed to purchase template');
    } finally {
      setPurchasingId(null);
    }
  };

  const handleSelectTemplate = (template: TextDesignTemplate) => {
    if (template.isPurchased || template.isFree) {
      onSelectTemplate?.(template);
    } else {
      handlePurchase(template.id);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Text Design Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our collection of beautiful text designs for your posts, comments, and messages
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                selectedCategory === category.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory === 'ALL' 
              ? 'No text design templates are available yet.' 
              : `No ${selectedCategory.toLowerCase()} templates available.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Preview */}
              <div className="h-32 bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
                {template.preview ? (
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div
                    style={template.styles}
                    className="text-center"
                  >
                    Sample Text
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {template.category && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {template.category}
                      </span>
                    )}
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                )}

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {template.isFree ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-medium">{template.price}</span>
                      </div>
                    )}
                    {template.isPurchased && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Owned
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectTemplate(template)}
                    disabled={purchasingId === template.id}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      template.isPurchased || template.isFree
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white',
                      purchasingId === template.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {purchasingId === template.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Purchasing...
                      </div>
                    ) : template.isPurchased || template.isFree ? (
                      'Use Template'
                    ) : (
                      'Purchase'
                    )}
                  </button>
                </div>

                {/* Iframe Preview */}
                {template.iframeUrl && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Advanced Design Tool:</div>
                    <div className="border border-gray-200 dark:border-gray-600 rounded">
                      <iframe
                        src={template.iframeUrl}
                        className="w-full h-24 rounded"
                        sandbox="allow-scripts allow-same-origin"
                        title={`${template.name} Design Tool`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}