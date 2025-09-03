import { uploadMedia, UploadResult } from './uploadMedia';
import { VisualMediaType } from '@prisma/client';

export async function savePostFiles(files: (Blob | string)[]): Promise<{
  type: VisualMediaType;
  fileName: string;
}[]> {
  // Create an array of promises
  const uploadPromises: Promise<{
    type: VisualMediaType;
    fileName: string;
  }>[] = files.map(async (file) => {
    if (typeof file === 'string') {
      // If it's already a URL/public ID, return it as is
      const fileName = file.split('/').pop()!;
      const type: VisualMediaType = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName) ? 'PHOTO' : 'VIDEO';
      return {
        type,
        fileName: file, // Keep the original public ID
      };
    }

    // If the item is Blob, upload it to Cloudinary
    const type: VisualMediaType = file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO';
    const fileExtension = file.type.split('/')[1];
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    const result = await uploadMedia(buffer, fileName, file.type);

    return { 
      type: result.type, 
      fileName: result.publicId // Store the Cloudinary public ID
    };
  });

  // Resolve all promises
  return Promise.all(uploadPromises);
}