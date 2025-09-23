'use client';

import Button from '@/components/ui/Button';
import { FallbackProfilePhoto } from '@/components/ui/FallbackProfilePhoto';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { useUserCosmetics } from '@/hooks/useUserCosmetics';
import { CosmeticOverlays } from '@/components/CosmeticOverlay';
import { Camera } from '@/svg_components';
import { useCallback, useRef } from 'react';

export default function ProfilePhoto({
  isOwnProfile,
  name,
  photoUrl,
  userId,
}: {
  isOwnProfile: boolean;
  name: string;
  photoUrl: string | null;
  userId?: string;
}) {
  const { inputFileRef, openInput, handleChange, isPending } = useUpdateProfileAndCoverPhotoClient('profile');
  const { showVisualMediaModal } = useVisualMediaModal();
  const { getActiveCosmetic } = useUserCosmetics(userId);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const showProfilePhotoModal = useCallback(() => {
    showVisualMediaModal({
      visualMedia: [
        {
          type: 'PHOTO',
          url: photoUrl as string,
        },
      ],
      initialSlide: 0,
    });
  }, [photoUrl, showVisualMediaModal]);

  // Get PFP_FRAME cosmetic for profile photo decorations
  const pfpFrameCosmetic = getActiveCosmetic('PFP_FRAME');
  const profileCosmetics = pfpFrameCosmetic ? [pfpFrameCosmetic] : [];

  return (
    <div ref={containerRef} className="absolute bottom-[-88px] h-44 w-44 border-white bg-cover">
      {photoUrl && (
        <img src={photoUrl} alt="Profile" className="absolute h-full w-full rounded-full border-4 object-cover" />
      )}
      {photoUrl ? (
        <button
          type="button"
          aria-label="Open profile photo"
          onClick={showProfilePhotoModal}
          className="absolute h-full w-full cursor-pointer rounded-full bg-black/30 opacity-0 active:opacity-100"
        />
      ) : (
        <FallbackProfilePhoto name={name} className="text-6xl" />
      )}
      
      {/* Cosmetic overlays for profile photo */}
      <CosmeticOverlays 
        cosmetics={profileCosmetics} 
        containerRef={containerRef}
        className="rounded-full overflow-hidden"
      />
      
      {isOwnProfile && (
        <label>
          <div className="absolute bottom-0 right-0">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button Icon={Camera} onPress={openInput} size="small" loading={isPending} />
          </div>
        </label>
      )}
    </div>
  );
}
