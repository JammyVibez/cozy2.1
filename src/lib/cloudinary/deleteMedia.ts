import 'server-only';
import { cloudinary } from './cloudinaryClient';

export async function deleteMedia(publicId: string): Promise<void> {
  try {
    // Try deleting as image first
    let result = await cloudinary.uploader.destroy(publicId);
    
    // If not found as image, try as video
    if (result.result === 'not found') {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Failed to delete media: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete media from Cloudinary');
  }
}