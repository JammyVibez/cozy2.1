'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface PremiumBadgeProps {
  type?: 'VERIFIED' | 'PREMIUM' | 'SUPPORTER' | 'CREATOR';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const badgeConfig = {
  VERIFIED: {
    icon: '✨',
    label: 'Verified',
    colors: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-100/80'
  },
  PREMIUM: {
    icon: '🏆',
    label: 'Premium',
    colors: 'from-purple-400 to-violet-500',
    textColor: 'text-purple-800',
    bgColor: 'bg-purple-100/80'
  },
  SUPPORTER: {
    icon: '💎',
    label: 'Supporter',
    colors: 'from-blue-400 to-cyan-500',
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-100/80'
  },
  CREATOR: {
    icon: '🎨',
    label: 'Creator',
    colors: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-800',
    bgColor: 'bg-pink-100/80'
  }
};

const sizeConfig = {
  small: {
    container: 'px-2 py-1 text-xs gap-1',
    icon: 'text-sm',
    text: 'text-xs font-medium'
  },
  medium: {
    container: 'px-3 py-1.5 text-sm gap-1.5',
    icon: 'text-base',
    text: 'text-sm font-semibold'
  },
  large: {
    container: 'px-4 py-2 text-base gap-2',
    icon: 'text-lg',
    text: 'text-base font-bold'
  }
};

export function PremiumBadge({ 
  type = 'VERIFIED', 
  size = 'medium', 
  className 
}: PremiumBadgeProps) {
  const badge = badgeConfig[type];
  const sizing = sizeConfig[size];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-sm',
        'shadow-sm transition-all duration-200 hover:scale-105',
        badge.bgColor,
        badge.textColor,
        sizing.container,
        className
      )}
    >
      <span className={cn('flex-shrink-0', sizing.icon)}>
        {badge.icon}
      </span>
      <span className={sizing.text}>
        {badge.label}
      </span>
    </motion.div>
  );
}

// Helper component for displaying in user profiles
export function UserPremiumBadge({ userId, className }: { userId: string; className?: string }) {
  // In a real implementation, you would fetch the user's badge from the API
  // For now, show a demo badge
  const hasBadge = true; // Replace with actual logic
  const badgeType = 'VERIFIED'; // Replace with actual badge type from user data

  if (!hasBadge) return null;

  return <PremiumBadge type={badgeType} size="small" className={className} />;
}