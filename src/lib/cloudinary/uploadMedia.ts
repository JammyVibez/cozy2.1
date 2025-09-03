import 'server-only';
import { cloudinary } from './cloudinaryClient';
import { VisualMediaType } from '@prisma/client';

export interface UploadResult {
  type: VisualMediaType;
  fileName: string;
  publicId: string;
  url: string;
  secureUrl: string;
}

export async function uploadMedia(file: Buffer, fileName: string, type: string): Promise<UploadResult> {
  try {
    // Convert buffer to base64
    const base64File = `data:${type};base64,${file.toString('base64')}`;
    
    // Determine resource type and folder
    const isVideo = type.startsWith('video/');
    const isAudio = type.startsWith('audio/');
    const resourceType = isVideo ? 'video' : isAudio ? 'video' : 'image'; // Cloudinary handles audio as video type
    const folder = isVideo ? 'munia/videos' : isAudio ? 'munia/audio' : 'munia/images';
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder,
      resource_type: resourceType,
      public_id: fileName.split('.')[0], // Remove extension as Cloudinary handles it
      overwrite: true,
      transformation: isVideo ? [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ]
    });

    // Determine media type for database
    let mediaType: VisualMediaType;
    if (isVideo || isAudio) {
      mediaType = 'VIDEO'; // We'll use VIDEO type for both video and audio
    } else {
      mediaType = 'PHOTO';
    }

    return {
      type: mediaType,
      fileName: result.public_id,
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload media to Cloudinary');
  }
}