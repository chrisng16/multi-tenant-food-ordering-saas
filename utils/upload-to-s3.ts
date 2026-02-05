/**
 * Upload a blob to S3 using presigned URL (tenant-aware)
 */
export async function uploadToS3(
    blob: Blob,
    filename: string,
    storeId: string,
    folder: string = 'products',
    onProgress?: (progress: number) => void
): Promise<string> {
    // Get presigned URL
    const presignedUrlResponse = await fetch('/api/aws/s3/get-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename,
            contentType: blob.type,
            storeId,
            folder,
        }),
    });

    if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get presigned URL');
    }

    const { uploadUrl, fileUrl } = await presignedUrlResponse.json();

    // Upload to S3
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                onProgress?.(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(fileUrl);
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', blob.type);
        xhr.send(blob);
    });
}