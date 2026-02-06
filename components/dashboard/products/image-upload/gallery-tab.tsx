"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { UploadedImage } from "./types";

interface GalleryTabProps {
    images: UploadedImage[];
    onDeleteImage: (imageId: string, imageKey: string) => Promise<void>;
    deletingIds: Set<string>;
}

export function GalleryTab({ images, onDeleteImage, deletingIds }: GalleryTabProps) {
    const [imageToDelete, setImageToDelete] = useState<UploadedImage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!imageToDelete) return;

        setIsDeleting(true);
        try {
            await onDeleteImage(imageToDelete.id, imageToDelete.key);
        } catch (error) {
            console.error("Failed to delete image:", error);
        } finally {
            setIsDeleting(false);
            setImageToDelete(null);
        }
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No images uploaded yet</p>
                <p className="text-sm mt-2">
                    Upload images in the Upload tab and save to see them here
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {images.length} image{images.length !== 1 ? "s" : ""} uploaded
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image) => {
                        const isDeleting = deletingIds.has(image.id);

                        return (
                            <div key={image.id} className="relative group">
                                <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
                                    <Image
                                        src={image.url}
                                        alt={image.filename}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    {isDeleting && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setImageToDelete(image)}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="mt-1">
                                    <p className="text-xs text-muted-foreground truncate">
                                        {image.filename}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(image.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AlertDialog
                open={!!imageToDelete}
                onOpenChange={() => !isDeleting && setImageToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this image? This action cannot be
                            undone and will remove the image from S3.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}