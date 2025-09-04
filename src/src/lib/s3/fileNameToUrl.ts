import 'server-only';
// Migrated from S3 to Cloudinary
import { getMediaUrl } from '../cloudinary/getMediaUrl';

/**
 * The database stores the Cloudinary public ID of the files (image/video),
 * use this function to get the full Cloudinary URL of the file.
 * 
 * MIGRATION NOTE: This now uses Cloudinary instead of AWS S3
 *
 * @param fileName The Cloudinary public ID of the image or video.
 * @returns The full URL of the image or video.
 */
export function fileNameToUrl(fileName: string | null) {
  if (!fileName) return null;
  
  // Handle legacy S3 URLs (during migration period)
  if (fileName.includes('amazonaws.com')) {
    return fileName;
  }
  
  // Use Cloudinary for new uploads
  return getMediaUrl(fileName);
}
