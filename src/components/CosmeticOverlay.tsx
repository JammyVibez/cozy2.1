'use client';

import { useEffect, useRef, useState } from 'react';

interface CosmeticOverlayProps {
  cosmetic: {
    id: string;
    type: string;
    name: string;
    assetUrl: string;
    assetType?: 'html' | 'gif' | 'image' | 'video' | 'svg';
    metadata?: any;
  };
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function CosmeticOverlay({ cosmetic, containerRef, className = '' }: CosmeticOverlayProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine asset type from URL or metadata
  const getAssetType = (url: string, metadata?: any): 'html' | 'gif' | 'image' | 'video' | 'svg' => {
    if (metadata?.assetType) return metadata.assetType;
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'gif') return 'gif';
    if (extension === 'svg') return 'svg';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video';
    if (extension === 'html' || url.includes('raw.githubusercontent.com')) return 'html';
    
    return 'html'; // Default to HTML for iframe rendering
  };

  const assetType = getAssetType(cosmetic.assetUrl, cosmetic.metadata);

  useEffect(() => {
    if (assetType === 'html') {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const handleLoad = () => {
        setIsLoaded(true);
        setError(false);
      };

      const handleError = () => {
        setError(true);
        setIsLoaded(false);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    } else {
      // For non-HTML assets, simulate loading
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [assetType]);

  // Don't render if there's an error loading the cosmetic
  if (error) {
    return null;
  }

  // Get positioning and styling from metadata
  const metadata = cosmetic.metadata || {};
  const position = metadata.position || 'center';
  const size = metadata.size || 'medium';
  const zIndex = metadata.zIndex || 10;
  const opacity = metadata.opacity || 1;

  // Size mappings
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20',
    full: 'w-full h-full'
  };

  // Position mappings
  const positionMap = {
    'top-left': 'top-2 left-2',
    'top-center': 'top-2 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-2 right-2',
    'center-left': 'top-1/2 left-2 transform -translate-y-1/2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-2 transform -translate-y-1/2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-center': 'bottom-2 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-2 right-2',
    'floating': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse'
  };

  const sizeClass = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;
  const positionClass = positionMap[position as keyof typeof positionMap] || positionMap.center;

  const renderAsset = () => {
    switch (assetType) {
      case 'gif':
      case 'image':
        return (
          <img
            src={cosmetic.assetUrl}
            alt={`${cosmetic.name} decoration`}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
          />
        );
      
      case 'video':
        return (
          <video
            src={cosmetic.assetUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setError(true)}
          />
        );
      
      case 'svg':
        return (
          <img
            src={cosmetic.assetUrl}
            alt={`${cosmetic.name} decoration`}
            className="w-full h-full object-contain"
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
          />
        );
      
      case 'html':
      default:
        return (
          <iframe
            ref={iframeRef}
            src={cosmetic.assetUrl}
            className="w-full h-full border-0 rounded-lg overflow-hidden"
            style={{
              background: 'transparent',
              pointerEvents: 'none'
            }}
            title={`${cosmetic.name} decoration`}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        );
    }
  };

  return (
    <div
      className={`absolute ${positionClass} ${sizeClass} pointer-events-none ${className}`}
      style={{
        zIndex,
        opacity: isLoaded ? opacity : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {renderAsset()}
      
      {/* Loading indicator */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

interface CosmeticOverlaysProps {
  cosmetics: Array<{
    id: string;
    type: string;
    name: string;
    assetUrl: string;
    assetType?: 'html' | 'gif' | 'image' | 'video' | 'svg';
    metadata?: any;
  }>;
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function CosmeticOverlays({ cosmetics, containerRef, className = '' }: CosmeticOverlaysProps) {
  if (!cosmetics || cosmetics.length === 0) {
    return null;
  }

  return (
    <>
      {cosmetics.map((cosmetic) => (
        <CosmeticOverlay
          key={cosmetic.id}
          cosmetic={cosmetic}
          containerRef={containerRef}
          className={className}
        />
      ))}
    </>
  );
}
