"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UploadProgress } from "@/hooks/use-image-upload";
import { cn } from "@/lib//utils/utils";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_FORMATS = {
    "image/webp": [".webp"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/avif": [".avif"],
};

interface UploadTabProps {
    pendingFiles: File[];
    onFilesAdded: (files: File[]) => void;
    onFileRemoved: (index: number) => void;
    canAddMore: boolean;
    maxImages: number;
    currentCount: number;
    isUploading: boolean;
    uploadProgress: UploadProgress | null;
}

export function UploadTab({
    pendingFiles,
    onFilesAdded,
    onFileRemoved,
    canAddMore,
    maxImages,
    currentCount,
    isUploading,
    uploadProgress,
}: UploadTabProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            if (rejectedFiles.length > 0) {
                // Handle rejected files
                console.error("Some files were rejected:", rejectedFiles);
                return;
            }

            onFilesAdded(acceptedFiles);
        },
        [onFilesAdded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FORMATS,
        maxSize: MAX_FILE_SIZE,
        disabled: !canAddMore || isUploading,
        multiple: true,
    });

    return (
        <div className="space-y-4">
            {/* Upload Progress */}
            {isUploading && uploadProgress && (
                <Card className="p-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                Uploading {uploadProgress.current} of {uploadProgress.total}
                            </span>
                            <span className="text-muted-foreground">
                                {uploadProgress.percentage}%
                            </span>
                        </div>
                        <Progress value={uploadProgress.percentage} className="h-2" />
                        {uploadProgress.currentFile && (
                            <p className="text-xs text-muted-foreground">
                                Current: {uploadProgress.currentFile}
                            </p>
                        )}
                    </div>
                </Card>
            )}

            {/* Dropzone */}
            <Card
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
                    isDragActive && "border-primary bg-primary/5",
                    !canAddMore && "opacity-50 cursor-not-allowed",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                {isDragActive ? (
                    <p className="text-lg">Drop the images here...</p>
                ) : (
                    <div>
                        <p className="text-lg mb-2">
                            Drag & drop images here, or click to select
                        </p>
                        <p className="text-sm text-muted-foreground">
                            WebP, PNG, JPEG, AVIF (max 4MB per file)
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {maxImages - currentCount - pendingFiles.length} images remaining
                        </p>
                    </div>
                )}
            </Card>

            {/* Pending Files Preview */}
            {pendingFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                            Ready to upload ({pendingFiles.length})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Click "Save Product" to upload
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {pendingFiles.map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    {isUploading && uploadProgress && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            {uploadProgress.current > index ? (
                                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                            ) : uploadProgress.current === index + 1 ? (
                                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                                            ) : (
                                                <div className="text-white text-sm">Waiting...</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {!isUploading && (
                                    <button
                                        type="button"
                                        onClick={() => onFileRemoved(index)}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {/* {pendingFiles.length === 0 && !isUploading && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No images selected</p>
                    <p className="text-sm mt-1">
                        Add images above - they'll upload when you save the product
                    </p>
                </div>
            )} */}
        </div>
    );
}