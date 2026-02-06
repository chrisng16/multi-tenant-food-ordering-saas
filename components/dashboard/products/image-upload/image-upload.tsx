"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImageUpload } from "@/hooks/use-image-upload";
import { forwardRef, useImperativeHandle, useState } from "react";
import { GalleryTab } from "./gallery-tab";
import type { ImageTag, UploadedImage } from "./types";
import { UploadSuccessToast } from "./upload-success-toast";
import { UploadTab } from "./upload-tab";

export type { ImageTag, UploadedImage } from "./types";

export interface ImageUploadProps {
    storeId: string;
    productId?: string;
    tag: ImageTag;
    maxImages?: number;
    existingImages?: UploadedImage[];
    onImagesChange?: (images: UploadedImage[]) => void;
    onPendingChange?: (files: File[]) => void;
}

export interface ImageUploadRef {
    uploadPendingFiles: () => Promise<UploadedImage[]>;
    getPendingCount: () => number;
    getUploadedCount: () => number;
    hasChanges: () => boolean;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
    function ImageUpload(
        {
            storeId,
            productId,
            tag,
            maxImages = 10,
            existingImages = [],
            onImagesChange,
            onPendingChange,
        },
        ref
    ) {
        const [activeTab, setActiveTab] = useState("upload");
        const [showSuccessToast, setShowSuccessToast] = useState(false);
        const [uploadedCount, setUploadedCount] = useState(0);

        const {
            uploadedImages,
            pendingFiles,
            isUploading,
            uploadProgress,
            deletingIds,
            canAddMore,
            hasChanges,
            addFiles,
            removePendingFile,
            clearPendingFiles,
            uploadPendingFiles,
            deleteUploadedImage,
        } = useImageUpload({
            storeId,
            productId,
            tag,
            maxImages,
            existingImages,
            onUploadComplete: (images) => {
                onImagesChange?.(images);
                setUploadedCount(images.length);
                setShowSuccessToast(true);
            },
        });

        // Expose methods to parent via ref
        useImperativeHandle(ref, () => ({
            uploadPendingFiles,
            getPendingCount: () => pendingFiles.length,
            getUploadedCount: () => uploadedImages.length,
            hasChanges: () => hasChanges,
        }));

        // Notify parent of pending changes
        const handleFilesAdded = (files: File[]) => {
            addFiles(files);
            onPendingChange?.([...pendingFiles, ...files]);
        };

        const handleFileRemoved = (index: number) => {
            removePendingFile(index);
            const updated = pendingFiles.filter((_, i) => i !== index);
            onPendingChange?.(updated);
        };

        return (
            <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            Upload
                            {pendingFiles.length > 0 && (
                                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    {pendingFiles.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="gallery">
                            Gallery
                            <Badge>{uploadedImages.length}/{maxImages}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                        <UploadTab
                            pendingFiles={pendingFiles}
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                            canAddMore={canAddMore}
                            maxImages={maxImages}
                            currentCount={uploadedImages.length}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                        />
                    </TabsContent>

                    <TabsContent value="gallery" className="mt-4">
                        <GalleryTab
                            images={uploadedImages}
                            onDeleteImage={deleteUploadedImage}
                            deletingIds={deletingIds}
                        />
                    </TabsContent>
                </Tabs>

                <UploadSuccessToast
                    show={showSuccessToast}
                    count={uploadedCount}
                    onClose={() => setShowSuccessToast(false)}
                    onViewGallery={() => setActiveTab("gallery")}
                />
            </>
        );
    }
);