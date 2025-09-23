'use client';

import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { useUserCosmetics } from '@/hooks/useUserCosmetics';
import { CosmeticOverlays } from '@/components/CosmeticOverlay';
import SvgImage from '@/svg_components/Image';
import { useCallback, useRef } from 'react';

export default function CoverPhoto({ 
  isOwnProfile, 
  photoUrl, 
  userId 
}: { 
  isOwnProfile: boolean; 
  photoUrl: string | null;
  userId?: string;
}) {
  const { inputFileRef, openInput, handleChange, isPending } = useUpdateProfileAndCoverPhotoClient('cover');
  const { showVisualMediaModal } = useVisualMediaModal();
  const { getActiveCosmetic } = useUserCosmetics(userId);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const openCoverPhoto = useCallback(() => {
    if (photoUrl) {
      showVisualMediaModal({
        visualMedia: [
          {
            type: 'PHOTO',
            url: photoUrl,
          },
        ],
        initialSlide: 0,
      });
    }
  }, [photoUrl, showVisualMediaModal]);

  // Get BANNER cosmetic for cover photo decorations
  const bannerCosmetic = getActiveCosmetic('BANNER');
  const coverCosmetics = bannerCosmetic ? [bannerCosmetic] : [];

  return (
    <div ref={containerRef} className="h-full w-full">
      {photoUrl && <img src={photoUrl} alt="" className="absolute h-full w-full object-cover" />}
      <button
        type="button"
        aria-label="Open cover photo"
        onClick={openCoverPhoto}
        className="absolute h-full w-full cursor-pointer bg-black/30 opacity-0 active:opacity-100"
      />
      
      {/* Cosmetic overlays for cover photo */}
      <CosmeticOverlays 
        cosmetics={coverCosmetics} 
        containerRef={containerRef}
        className="rounded-3xl overflow-hidden"
      />
      
      {isOwnProfile && (
        <label>
          <div className="absolute bottom-4 right-4">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button
              Icon={SvgImage}
              iconClassName="text-primary-foreground"
              onPress={openInput}
              size="small"
              loading={isPending}
            />
          </div>
        </label>
      )}
    </div>
  );
}
