import 'server-only';
// Migrated from S3 to Cloudinary
import { deleteMedia } from '../cloudinary/deleteMedia';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';

/**
 * Delete media from storage.
 * MIGRATION NOTE: This now uses Cloudinary for new files and S3 for legacy files
 */
export async function deleteObject(fileName: string) {
  // Handle legacy S3 files (during migration period)
  if (fileName.includes('amazonaws.com') || !fileName.includes('/')) {
    if (!s3Client) {
      console.warn('S3 client not available. Cannot delete legacy S3 file:', fileName);
    } else {
      try {
        const command = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
        });
        await s3Client.send(command);
      } catch (error) {
        console.error('S3 delete error (legacy file):', error);
        // Continue with Cloudinary deletion attempt
      }
    }
  }
  
  // Use Cloudinary for new files (Cloudinary public IDs contain forward slashes)
  if (fileName.includes('/')) {
    await deleteMedia(fileName);
  }
}
