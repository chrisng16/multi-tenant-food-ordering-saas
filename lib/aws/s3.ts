import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name';
const UPLOAD_FOLDER = 'product-images'; // Organize uploads in a folder

/**
 * Generate a presigned URL for direct upload to S3
 */
export async function generatePresignedUrl(
    storeId: string,
    filename: string,
    contentType: string,
    folder: string = 'products', // 'products', 'logos', 'profiles', etc.
    expiresIn: number = 3600
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    // Generate a unique key for the file
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `stores/${storeId}/${folder}/${timestamp}-${randomString}-${sanitizedFilename}`;

    // Create the PutObject command
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    // Generate presigned URL
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

    // Construct the public URL (adjust based on your CloudFront/CDN setup)
    const fileUrl = process.env.AWS_CLOUDFRONT_URL
        ? `https://${process.env.AWS_CLOUDFRONT_URL}/${key}`
        : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-1'}.amazonaws.com/${key}`;
    return {
        uploadUrl,
        fileUrl,
        key,
    };
}

/**
 * Direct upload to S3 (server-side)
 * Use this if you want to handle uploads on your backend instead of presigned URLs
 */
export async function uploadToS3(
    storeId: string,
    buffer: Buffer,
    filename: string,
    contentType: string,
    folder: string = 'products'
): Promise<string> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `stores/${storeId}/${folder}/${timestamp}-${randomString}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Optional: Set cache control
        CacheControl: 'max-age=31536000',
        // Optional: Make the file public (remove if you want private files)
        ACL: 'public-read',
    });

    await s3Client.send(command);

    // Return the public URL
    const fileUrl = process.env.AWS_CLOUDFRONT_URL
        ? `https://${process.env.AWS_CLOUDFRONT_URL}/${key}`
        : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-1'}.amazonaws.com/${key}`;
    return fileUrl;
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

/**
 * Extract S3 key from URL
 */
export function extractS3Key(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathMatch = urlObj.pathname.match(/^\/(.+)$/);
        return pathMatch ? pathMatch[1] : null;
    } catch {
        return null;
    }
}

/**
 * Validate that a key belongs to a tenant (security check)
 */
export function validateTenantAccess(key: string, storeId: string): boolean {
    return key.startsWith(`stores/${storeId}/`);
}