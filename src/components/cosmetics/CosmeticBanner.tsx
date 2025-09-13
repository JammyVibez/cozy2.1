'use client';

import { useCosmetics } from './CosmeticProvider';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { cn } from '@/lib/cn';

interface CosmeticBannerProps {
  className?: string;
  fallbackBanner?: string;
}

export function CosmeticBanner({ className, fallbackBanner }: CosmeticBannerProps) {
  const { getActiveCosmetic } = useCosmetics();
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;
  const activeBanner = getActiveCosmetic('BANNER');

  const bannerUrl = activeBanner?.assetUrl || fallbackBanner;

  if (!bannerUrl) return null;

  return (
    <div 
      className={cn(
        'w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-lg transition-all duration-200',
        'border border-border/20 backdrop-blur-sm',
        `theme-${variant}-banner`,
        actualMode,
        className
      )}
      style={{
        backgroundImage: `url(${bannerUrl})`
      }}
      data-theme={variant}
    />
  );
}