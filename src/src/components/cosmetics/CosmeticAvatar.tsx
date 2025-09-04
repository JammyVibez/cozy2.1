'use client';

import { useCosmetics } from './CosmeticProvider';
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
  const activeFrame = getActiveCosmetic('PFP_FRAME');

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Avatar Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
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