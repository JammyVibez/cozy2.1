'use client';

import { useCosmetics } from './CosmeticProvider';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { cn } from '@/lib/cn';

interface CosmeticNameplateProps {
  username: string;
  className?: string;
}

export function CosmeticNameplate({ username, className }: CosmeticNameplateProps) {
  const { getActiveCosmetic } = useCosmetics();
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;
  const activeNameplate = getActiveCosmetic('NAMEPLATE');

  if (!activeNameplate) {
    return (
      <span 
        className={cn(
          'font-semibold transition-colors duration-200',
          'text-foreground',
          `theme-${variant}-nameplate`,
          className
        )}
        data-theme={variant}
      >
        {username}
      </span>
    );
  }

  // Apply nameplate styles based on metadata and theme
  const nameplateStyles = activeNameplate.metadata?.styles || {};
  
  return (
    <span 
      className={cn(
        'font-semibold relative transition-all duration-200',
        'text-foreground',
        `theme-${variant}-nameplate-cosmetic`,
        actualMode,
        className
      )}
      style={{
        ...nameplateStyles,
        backgroundImage: activeNameplate.assetUrl ? `url(${activeNameplate.assetUrl})` : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      data-theme={variant}
    >
      {username}
      {activeNameplate.metadata?.overlay && (
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-200",
            `theme-${variant}-nameplate-overlay`
          )}
          style={{
            backgroundImage: `url(${activeNameplate.assetUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            mixBlendMode: activeNameplate.metadata.blendMode || 'normal'
          }}
          data-theme={variant}
        />
      )}
    </span>
  );
}