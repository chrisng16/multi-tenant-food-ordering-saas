import { useCallback, useState } from 'react';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
    s3Url?: string;
}

export function useImageUpload() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const addImages = useCallback((files: File[]) => {
        const newImages: ImageFile[] = files.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending',
        }));
        setImages((prev) => [...prev, ...newImages]);
        return newImages;
    }, []);

    const removeImage = useCallback((id: string) => {
        setImages((prev) => {
            const image = prev.find((img) => img.id === id);
            if (image) {
                URL.revokeObjectURL(image.preview);
            }
            return prev.filter((img) => img.id !== id);
        });
    }, []);

    const updateImageProgress = useCallback((id: string, progress: number) => {
        setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, progress } : img))
        );
    }, []);

    const updateImageStatus = useCallback(
        (
            id: string,
            status: ImageFile['status'],
            data?: { s3Url?: string; errorMessage?: string }
        ) => {
            setImages((prev) =>
                prev.map((img) =>
                    img.id === id ? { ...img, status, ...data } : img
                )
            );
        },
        []
    );

    const clearImages = useCallback(() => {
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
    }, [images]);

    const resetUploadState = useCallback(() => {
        setIsUploading(false);
    }, []);

    return {
        images,
        isUploading,
        setIsUploading,
        addImages,
        removeImage,
        updateImageProgress,
        updateImageStatus,
        clearImages,
        resetUploadState,
    };
}