
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  price: number;
  popularity: number;
}

interface CommunityTemplateSelectorProps {
  onTemplateSelect: (template: CommunityTemplate) => void;
  selectedTemplate?: string;
}

const templates: CommunityTemplate[] = [
  {
    id: 'gaming-guild',
    name: 'Gaming Guild',
    description: 'Perfect for gaming communities with tournaments, leaderboards, and game rooms',
    category: 'GAMING',
    preview: '🎮',
    features: ['Tournament System', 'Leaderboards', 'Game Rooms', 'Achievement System'],
    price: 0,
    popularity: 95
  },
  {
    id: 'tech-hub',
    name: 'Tech Hub',
    description: 'Developer-focused community with code sharing, project showcases, and tech discussions',
    category: 'TECHNOLOGY',
    preview: '💻',
    features: ['Code Snippets', 'Project Showcase', 'Tech News', 'Skill Matching'],
    price: 0,
    popularity: 88
  },
  {
    id: 'crypto-traders',
    name: 'Crypto Traders',
    description: 'Cryptocurrency trading community with market analysis and portfolio tracking',
    category: 'CRYPTOCURRENCY',
    preview: '₿',
    features: ['Price Alerts', 'Portfolio Tracker', 'Trading Signals', 'Market Analysis'],
    price: 5,
    popularity: 82
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Art and design community for sharing work, getting feedback, and collaborating',
    category: 'ART',
    preview: '🎨',
    features: ['Portfolio Gallery', 'Feedback System', 'Collaboration Tools', 'Design Resources'],
    price: 3,
    popularity: 78
  },
  {
    id: 'learning-circle',
    name: 'Learning Circle',
    description: 'Educational community with courses, study groups, and knowledge sharing',
    category: 'EDUCATION',
    preview: '📚',
    features: ['Course System', 'Study Groups', 'Progress Tracking', 'Resource Library'],
    price: 2,
    popularity: 85
  },
  {
    id: 'business-network',
    name: 'Business Network',
    description: 'Professional networking with business discussions and industry insights',
    category: 'BUSINESS',
    preview: '💼',
    features: ['Networking Events', 'Business Cards', 'Industry News', 'Job Board'],
    price: 7,
    popularity: 72
  }
];

export function CommunityTemplateSelector({ onTemplateSelect, selectedTemplate }: CommunityTemplateSelectorProps) {
  const [category, setCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popularity' | 'price' | 'name'>('popularity');

  const categories = ['ALL', 'GAMING', 'TECHNOLOGY', 'CRYPTOCURRENCY', 'ART', 'EDUCATION', 'BUSINESS'];

  const filteredTemplates = templates
    .filter(template => category === 'ALL' || template.category === category)
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Community Template</h2>
        <p className="text-muted-foreground">Select a pre-built template to get started quickly</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted-foreground/10'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
        >
          <option value="popularity">Popular</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'relative p-6 rounded-xl border transition-all duration-200 cursor-pointer group',
              'hover:shadow-lg hover:scale-[1.02]',
              selectedTemplate === template.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            )}
            onClick={() => onTemplateSelect(template)}
          >
            {/* Popular Badge */}
            {template.popularity >= 85 && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                🔥 Popular
              </div>
            )}

            {/* Preview */}
            <div className="text-4xl mb-4 text-center">{template.preview}</div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">INCLUDED FEATURES</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-muted rounded-md text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>⭐ {template.popularity}%</span>
                </div>
                <div className="font-semibold">
                  {template.price === 0 ? 'Free' : `${template.price} coins`}
                </div>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more templates.</p>
        </div>
      )}
    </div>
  );
}
