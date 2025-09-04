'use client';

import { useCosmetics } from './CosmeticProvider';
import { cn } from '@/lib/cn';

interface CosmeticNameplateProps {
  username: string;
  className?: string;
}

export function CosmeticNameplate({ username, className }: CosmeticNameplateProps) {
  const { getActiveCosmetic } = useCosmetics();
  const activeNameplate = getActiveCosmetic('NAMEPLATE');

  if (!activeNameplate) {
    return (
      <span className={cn('font-semibold', className)}>
        {username}
      </span>
    );
  }

  // Apply nameplate styles based on metadata
  const nameplateStyles = activeNameplate.metadata?.styles || {};
  
  return (
    <span 
      className={cn('font-semibold relative', className)}
      style={{
        ...nameplateStyles,
        backgroundImage: activeNameplate.assetUrl ? `url(${activeNameplate.assetUrl})` : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      {username}
      {activeNameplate.metadata?.overlay && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${activeNameplate.assetUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            mixBlendMode: activeNameplate.metadata.blendMode || 'normal'
          }}
        />
      )}
    </span>
  );
}