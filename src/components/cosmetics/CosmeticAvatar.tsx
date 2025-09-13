'use client';

import { useCosmetics } from './CosmeticProvider';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { cn } from '@/lib/cn';

interface CosmeticAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function CosmeticAvatar({ src, alt, size = 'md', className }: CosmeticAvatarProps) {
  const { getActiveCosmetic } = useCosmetics();
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;
  const activeFrame = getActiveCosmetic('PFP_FRAME');

  return (
    <div 
      className={cn(
        'relative transition-all duration-200',
        sizeClasses[size],
        `theme-${variant}-avatar`,
        actualMode,
        className
      )}
      data-theme={variant}
    >
      {/* Avatar Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full rounded-full object-cover transition-all duration-200",
          `theme-${variant}-avatar-image`
        )}
      />
      
      {/* PFP Frame Overlay */}
      {activeFrame?.assetUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={activeFrame.assetUrl}
            alt={`${activeFrame.name} frame`}
            className="w-full h-full object-cover"
            style={{
              mixBlendMode: activeFrame.metadata?.blendMode || 'normal'
            }}
          />
        </div>
      )}
    </div>
  );
}