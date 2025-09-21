'use client';

import { useState } from 'react';

type FilterType = 'for-you' | 'following' | 'trending' | 'latest';

interface FeedFiltersProps {
  onFilterChange?: (filter: FilterType) => void;
}

export function FeedFilters({ onFilterChange }: FeedFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');

  const filters = [
    { id: 'for-you' as const, label: 'For You', icon: '✨' },
    { id: 'following' as const, label: 'Following', icon: '👥' },
    { id: 'trending' as const, label: 'Trending', icon: '🔥' },
    { id: 'latest' as const, label: 'Latest', icon: '⚡' },
  ];

  const handleFilterClick = (filterId: FilterType) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeFilter === filter.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-sm">{filter.icon}</span>
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
