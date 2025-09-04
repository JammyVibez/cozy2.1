import 'server-only';
import { S3Client } from '@aws-sdk/client-s3';

// https://github.com/aws/aws-sdk-net/issues/1713
// Create S3 client only if credentials are properly configured
export const s3Client = (() => {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey || 
      region === 'placeholder' || accessKeyId === 'placeholder' || secretAccessKey === 'placeholder') {
    console.warn('S3 credentials not properly configured. File upload functionality will be disabled.');
    return null;
  }

  try {
    return new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  } catch (error) {
    console.warn('Failed to initialize S3 client:', error);
    return null;
  }
})();
