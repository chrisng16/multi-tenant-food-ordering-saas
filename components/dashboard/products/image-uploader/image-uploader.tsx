import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useImageUpload } from '@/hooks/use-image-upload';
import { transcodeImage } from '@/lib/utils';
import { uploadToS3 } from '@/utils/upload-to-s3';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ImageGallery } from './image-gallery';
import { UploadModal } from './upload-modal';

interface ImageUploaderProps {
    folder?: string;
    existingImages?: string[];
    onImagesUploaded?: (urls: string[]) => void;
    onImageDeleted?: (url: string) => void;
    onImageAdded?: (images: string[]) => void;
    maxFiles?: number;
    storeId: string
}

export function ImageUploader({
    folder = 'products',
    existingImages = [],
    onImagesUploaded,
    onImageDeleted,
    onImageAdded,
    maxFiles = 10,
    storeId
}: ImageUploaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedImages, setDisplayedImages] = useState<string[]>(existingImages);

    const {
        images,
        isUploading,
        setIsUploading,
        addImages,
        removeImage,
        updateImageProgress,
        updateImageStatus,
        clearImages,
    } = useImageUpload();

    const handleDeleteExistingImage = async (url: string) => {
        if (confirm('Are you sure you want to delete this image?')) {
            setDisplayedImages((prev) => prev.filter((img) => img !== url));
            onImageDeleted?.(url);
        }
    };

    const handleImagesAdded = (files: File[]) => {
        addImages(files);
    };

    // const handleUpload = () => {
    //     onImageAdded?.(images.map(img => img.preview))
    //     setIsModalOpen(false)
    // }

    const handleUpload = async () => {
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        for (const image of images) {
            if (image.status === 'success') {
                uploadedUrls.push(image.s3Url!);
                continue;
            }

            try {
                updateImageStatus(image.id, 'uploading');

                // Transcode image
                const transcodedBlob = await transcodeImage(image.file, (progress) => {
                    updateImageProgress(image.id, Math.floor(progress * 0.3));
                });

                // Generate filename
                const extension = transcodedBlob.type.split('/')[1] || 'jpg';
                const filename = `${Date.now()}-${image.id}.${extension}`;

                // Upload to S3 with store ID
                const s3Url = await uploadToS3(
                    transcodedBlob,
                    filename,
                    storeId, // Pass store ID
                    folder, // Pass folder
                    (progress) => {
                        updateImageProgress(image.id, 30 + Math.floor(progress * 0.7));
                    }
                );

                updateImageStatus(image.id, 'success', { s3Url });
                uploadedUrls.push(s3Url);
            } catch (error) {
                updateImageStatus(image.id, 'error', {
                    errorMessage: error instanceof Error ? error.message : 'Upload failed',
                });
            }
        }

        setIsUploading(false);

        if (uploadedUrls.length > 0) {
            setDisplayedImages((prev) => [...prev, ...uploadedUrls]);
            onImagesUploaded?.(uploadedUrls);

            console.log('Uploaded URLs:', uploadedUrls);

            setTimeout(() => {
                setIsModalOpen(false);
                clearImages();
            }, 500);
        }
    };


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>
                                {displayedImages.length} of {maxFiles} images uploaded
                            </CardDescription>
                        </div>
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            disabled={displayedImages.length >= maxFiles}
                            size="sm"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Images
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImageGallery
                        images={images.map(img => img.preview)}
                        onDelete={handleDeleteExistingImage}
                    />
                </CardContent>
            </Card>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    clearImages();
                }}
                images={images}
                onImagesAdded={handleImagesAdded}
                onImageRemove={removeImage}
                onUpload={handleUpload}
                isUploading={isUploading}
            />
        </>
    );
}