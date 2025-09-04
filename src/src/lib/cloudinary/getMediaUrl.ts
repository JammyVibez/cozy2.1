import { cloudinary } from './cloudinaryClient';

export function getMediaUrl(publicId: string | null, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
}): string | null {
  if (!publicId) return null;

  try {
    // Generate optimized URL with transformations
    return cloudinary.url(publicId, {
      secure: true,
      quality: options?.quality || 'auto',
      fetch_format: options?.format || 'auto',
      width: options?.width,
      height: options?.height,
      crop: options?.crop || 'fill',
    });
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error);
    return null;
  }
}

// Helper for profile photos with specific optimizations
export function getProfilePhotoUrl(publicId: string | null): string | null {
  return getMediaUrl(publicId, {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
  });
}

// Helper for cover photos
export function getCoverPhotoUrl(publicId: string | null): string | null {
  return getMediaUrl(publicId, {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
  });
}

// Helper for post media with responsive sizing
export function getPostMediaUrl(publicId: string | null, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string | null {
  const sizeConfig = {
    thumbnail: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  };

  return getMediaUrl(publicId, {
    ...sizeConfig[size],
    crop: 'limit', // Don't crop, just resize to fit
    quality: 'auto',
  });
}