'use client';

import { useCosmetics } from './CosmeticProvider';
import { cn } from '@/lib/cn';

interface CosmeticBannerProps {
  className?: string;
  fallbackBanner?: string;
}

export function CosmeticBanner({ className, fallbackBanner }: CosmeticBannerProps) {
  const { getActiveCosmetic } = useCosmetics();
  const activeBanner = getActiveCosmetic('BANNER');

  const bannerUrl = activeBanner?.assetUrl || fallbackBanner;

  if (!bannerUrl) return null;

  return (
    <div 
      className={cn(
        'w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-lg',
        className
      )}
      style={{
        backgroundImage: `url(${bannerUrl})`
      }}
    />
  );
}