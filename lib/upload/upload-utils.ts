import type { ImageTag, UploadedImage } from "@/components/dashboard/products/image-upload/image-upload";

interface UploadImagesParams {
    files: File[];
    storeId: string;
    productId?: string;
    tag: ImageTag;
}

/**
 * Convert image to WebP or AVIF format with fallback
 */
async function transcodeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // Try AVIF first (best compression)
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        // Fallback to WebP
                        canvas.toBlob(
                            (webpBlob) => {
                                if (webpBlob) {
                                    resolve(webpBlob);
                                } else {
                                    // Final fallback to original
                                    resolve(file);
                                }
                            },
                            "image/webp",
                            0.9
                        );
                    }
                },
                "image/avif",
                0.85
            );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName: string, mimeType: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const extension = mimeType.split("/")[1] || "jpg";
    const sanitized = originalName
        .split(".")[0]
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();

    return `${sanitized}-${timestamp}-${random}.${extension}`;
}

/**
 * Get presigned URL from API
 */
async function getPresignedUrl(key: string, mimeType: string): Promise<string> {
    const response = await fetch("/api/images/get-presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, mimeType }),
    });

    if (!response.ok) {
        throw new Error("Failed to get presigned URL");
    }

    const data = await response.json();
    return data.url;
}

/**
 * Upload file to S3 using presigned URL
 */
async function uploadToS3(presignedUrl: string, file: Blob, mimeType: string): Promise<void> {
    const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": mimeType,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to upload to S3");
    }
}

/**
 * Save image metadata to database
 */
async function saveImageMetadata(params: {
    storeId: string;
    productId?: string;
    tag: ImageTag;
    filename: string;
    url: string;
    key: string;
    size: number;
    mimeType: string;
}): Promise<UploadedImage> {
    const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw new Error("Failed to save image metadata");
    }

    return response.json();
}

/**
 * Main upload function
 */
export async function uploadImages({
    files,
    storeId,
    productId,
    tag,
}: UploadImagesParams): Promise<UploadedImage[]> {
    const uploadedImages: UploadedImage[] = [];

    for (const file of files) {
        try {
            // Transcode image
            const transcodedBlob = await transcodeImage(file);
            const mimeType = transcodedBlob.type;

            // Generate S3 key
            const filename = generateUniqueFilename(file.name, mimeType);
            const key = `stores/${storeId}/${tag}/${filename}`;

            // Get presigned URL
            const presignedUrl = await getPresignedUrl(key, mimeType);

            // Upload to S3
            await uploadToS3(presignedUrl, transcodedBlob, mimeType);

            // Save metadata to database
            const cloudFrontUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${key}`;
            const savedImage = await saveImageMetadata({
                storeId,
                productId,
                tag,
                filename,
                url: cloudFrontUrl,
                key,
                size: transcodedBlob.size,
                mimeType,
            });

            uploadedImages.push(savedImage);
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            throw error;
        }
    }

    return uploadedImages;
}

/**
 * Delete image from S3 and database
 */
export async function deleteImage(key: string): Promise<void> {
    const response = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete image");
    }
}