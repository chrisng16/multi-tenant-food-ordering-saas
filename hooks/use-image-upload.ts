import type { ImageTag, UploadedImage } from "@/components/dashboard/products/image-upload/types";
import { deleteImage, uploadImages } from "@/lib/upload/upload-utils";
import { useCallback, useState } from "react";

export interface UseImageUploadOptions {
    storeId: string;
    productId?: string;
    tag: ImageTag;
    maxImages?: number;
    existingImages?: UploadedImage[];
    onUploadComplete?: (images: UploadedImage[]) => void;
    onError?: (error: Error) => void;
}

export interface UploadProgress {
    current: number;
    total: number;
    percentage: number;
    currentFile?: string;
}

export function useImageUpload({
    storeId,
    productId,
    tag,
    maxImages = 10,
    existingImages = [],
    onUploadComplete,
    onError,
}: UseImageUploadOptions) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(existingImages);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // Add files to pending queue
    const addFiles = useCallback(
        (files: File[]) => {
            const remainingSlots = maxImages - (uploadedImages.length + pendingFiles.length);
            const filesToAdd = files.slice(0, remainingSlots);
            setPendingFiles((prev) => [...prev, ...filesToAdd]);
        },
        [maxImages, uploadedImages.length, pendingFiles.length]
    );

    // Remove file from pending queue
    const removePendingFile = useCallback((index: number) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // Clear all pending files
    const clearPendingFiles = useCallback(() => {
        setPendingFiles([]);
    }, []);

    // Upload all pending files
    const uploadPendingFiles = useCallback(async () => {
        if (pendingFiles.length === 0) return [];

        setIsUploading(true);
        setUploadProgress({
            current: 0,
            total: pendingFiles.length,
            percentage: 0,
        });

        try {
            const uploadedBatch: UploadedImage[] = [];

            for (let i = 0; i < pendingFiles.length; i++) {
                const file = pendingFiles[i];

                setUploadProgress({
                    current: i + 1,
                    total: pendingFiles.length,
                    percentage: Math.round(((i + 1) / pendingFiles.length) * 100),
                    currentFile: file.name,
                });

                const [uploaded] = await uploadImages({
                    files: [file],
                    storeId,
                    productId,
                    tag,
                });

                uploadedBatch.push(uploaded);
            }

            setUploadedImages((prev) => [...prev, ...uploadedBatch]);
            setPendingFiles([]);
            onUploadComplete?.(uploadedBatch);

            return uploadedBatch;
        } catch (error) {
            const err = error instanceof Error ? error : new Error("Upload failed");
            onError?.(err);
            throw err;
        } finally {
            setIsUploading(false);
            setUploadProgress(null);
        }
    }, [pendingFiles, storeId, productId, tag, onUploadComplete, onError]);

    // Delete an uploaded image
    const deleteUploadedImage = useCallback(
        async (imageId: string, imageKey: string) => {
            setDeletingIds((prev) => new Set(prev).add(imageId));

            try {
                await deleteImage(imageKey);
                setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
            } catch (error) {
                const err = error instanceof Error ? error : new Error("Delete failed");
                onError?.(err);
                throw err;
            } finally {
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(imageId);
                    return next;
                });
            }
        },
        [onError]
    );

    // Bulk delete multiple images
    const bulkDeleteImages = useCallback(
        async (images: Array<{ id: string; key: string }>) => {
            const ids = images.map((img) => img.id);
            setDeletingIds((prev) => new Set([...prev, ...ids]));

            try {
                await Promise.all(images.map((img) => deleteImage(img.key)));
                setUploadedImages((prev) => prev.filter((img) => !ids.includes(img.id)));
            } catch (error) {
                const err = error instanceof Error ? error : new Error("Bulk delete failed");
                onError?.(err);
                throw err;
            } finally {
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    ids.forEach((id) => next.delete(id));
                    return next;
                });
            }
        },
        [onError]
    );

    const canAddMore = uploadedImages.length + pendingFiles.length < maxImages;
    const hasChanges = pendingFiles.length > 0;

    return {
        // State
        uploadedImages,
        pendingFiles,
        isUploading,
        uploadProgress,
        deletingIds,
        canAddMore,
        hasChanges,

        // Actions
        addFiles,
        removePendingFile,
        clearPendingFiles,
        uploadPendingFiles,
        deleteUploadedImage,
        bulkDeleteImages,
    };
}