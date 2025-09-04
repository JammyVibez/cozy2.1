'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface CommunityTabsProps {
  communityId: string;
  activeTab: string;
}

const tabs = [
  { id: 'posts', label: 'Posts', icon: '📝' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'members', label: 'Members', icon: '👥' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

export function CommunityTabs({ communityId, activeTab }: CommunityTabsProps) {
  return (
    <div className="border-b border-border">
      <div className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `/communities/${communityId}${tab.id === 'posts' ? '' : `?tab=${tab.id}`}`;
          const isActive = activeTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={href}
              className={cn(
                'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}