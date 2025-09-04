'use client';

import { Search } from '@/svg_components';
import { cn } from '@/lib/cn';

const categories = [
  { value: 'ALL', label: 'All', emoji: '🌐' },
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

interface CommunityFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'trending' | 'newest' | 'members';
  onSortChange: (sort: 'trending' | 'newest' | 'members') => void;
}

export function CommunityFilter({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: CommunityFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            )}
          >
            <span>{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <div className="flex gap-2">
          {[
            { value: 'trending', label: 'Trending' },
            { value: 'newest', label: 'Newest' },
            { value: 'members', label: 'Most Members' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value as any)}
              className={cn(
                'px-3 py-1 rounded-md text-sm transition-colors',
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}