import 'server-only';
// Migrated from S3 to Cloudinary
import { savePostFiles as cloudinarySavePostFiles } from '../cloudinary/savePostFiles';

/**
 * Use this function to efficiently save multiple files of a post.
 * If it encounters a `Blob`, it saves it to Cloudinary.
 * If it encounters a URL, it will return that URL instead of re-saving it.
 * 
 * MIGRATION NOTE: This now uses Cloudinary instead of AWS S3
 */
export const savePostFiles = cloudinarySavePostFiles;
