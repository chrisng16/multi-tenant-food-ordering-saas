import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import {
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon,
    Loader2,
    Upload
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageCarousel } from './image-carousel';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
    s3Url?: string;
}

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;

    /** New-only images selected within this modal */
    images: ImageFile[];

    onImagesAdded: (files: File[]) => void;
    onImageRemove: (id: string) => void;
    onUpload: () => Promise<void> | void;
    isUploading: boolean;
    displayMode?: 'grid' | 'carousel';
}

const MAX_PER_UPLOAD = 10;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

function getExt(filename: string): string {
    const i = filename.lastIndexOf('.');
    return i === -1 ? '' : filename.slice(i + 1).toLowerCase();
}

function fileKey(f: File): string {
    // de-dupe: compare file size + name + extension
    return `${f.name.toLowerCase()}|${getExt(f.name)}|${f.size}`;
}

type RejectionState = {
    message: string;
    files: string[];
    reasons: Record<string, string>;
};

export function UploadModal({
    isOpen,
    onClose,
    images,
    onImagesAdded,
    onImageRemove,
    onUpload,
    isUploading,
    displayMode = 'carousel'
}: UploadModalProps) {
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [rejectionState, setRejectionState] = useState<RejectionState | null>(
        null
    );

    const selectedCount = images.length;
    const remainingCapacity = Math.max(0, MAX_PER_UPLOAD - selectedCount);

    const existingKeys = useMemo(() => {
        const set = new Set<string>();
        for (const img of images) set.add(fileKey(img.file));
        return set;
    }, [images]);

    const showRejectionDialog = useCallback(
        (files: string[], reasons: Record<string, string>) => {
            if (files.length === 0) return;

            const msg = `Cannot insert ${files.length} image${files.length !== 1 ? 's' : ''
                }.`;

            setRejectionState({
                message: msg,
                files,
                reasons,
            });
            setRejectionDialogOpen(true);
        },
        []
    );

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            const rejectedNames: string[] = [];
            const reasons: Record<string, string> = {};

            // 1) Dropzone validation rejections (size/type)
            if (rejectedFiles?.length) {
                rejectedFiles.forEach(({ file, errors }: any) => {
                    rejectedNames.push(file.name);

                    const reason =
                        errors?.[0]?.code === 'file-too-large'
                            ? 'File too large (max 4MB).'
                            : errors?.[0]?.code === 'file-invalid-type'
                                ? 'Unsupported format (PNG, JPG, WebP only).'
                                : 'Rejected.';

                    reasons[file.name] = reason;
                });
            }

            // Nothing accepted; show dialog if we have any rejections
            if (!acceptedFiles?.length) {
                showRejectionDialog(rejectedNames, reasons);
                return;
            }

            // 2) Dedupe FIRST (against existing selection + within batch)
            const seen = new Set<string>(existingKeys);
            const unique: File[] = [];
            const dupes: File[] = [];

            for (const f of acceptedFiles) {
                const key = fileKey(f);
                if (seen.has(key)) {
                    dupes.push(f);
                    continue;
                }
                seen.add(key);
                unique.push(f);
            }

            // Record dupes as rejected
            for (const f of dupes) {
                rejectedNames.push(f.name);
                reasons[f.name] = 'Duplicate (same name, extension, and size).';
            }

            // 3) Apply limit AFTER dedupe (insert up to remainingCapacity)
            const toAdd = unique.slice(0, remainingCapacity);
            const overflow = unique.slice(remainingCapacity);

            for (const f of overflow) {
                rejectedNames.push(f.name);
                reasons[f.name] = `Limit reached (max ${MAX_PER_UPLOAD} images).`;
            }

            if (toAdd.length > 0) {
                onImagesAdded(toAdd);
            }

            // Show dialog listing everything we couldn't insert (invalid + dupes + overflow)
            showRejectionDialog(rejectedNames, reasons);
        },
        [existingKeys, remainingCapacity, onImagesAdded, showRejectionDialog]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
        },
        maxSize: MAX_FILE_SIZE,
        multiple: true,

        // Allow selecting many; we enforce dedupe + MAX_PER_UPLOAD ourselves.
        maxFiles: 999,

        // Use explicit button to open file picker
        noClick: false,
    });

    const hasImages = images.length > 0;
    const allUploaded = hasImages && images.every((img) => img.status === 'success');
    const canUpload = hasImages && !isUploading && !allUploaded;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(openDialog) => !openDialog && onClose()}>
                <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] sm:max-w-2xl overflow-x-hidden overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Upload Images</DialogTitle>
                        <DialogDescription className='text-sm'>
                            Add up to {MAX_PER_UPLOAD} image{Number(MAX_PER_UPLOAD) !== 1 ? 's' : ''} per
                            upload (PNG, JPG, WebP, max 4MB each).
                            <span className="block mt-1 text-xs text-muted-foreground">
                                Selected: {selectedCount}/{MAX_PER_UPLOAD} • Remaining:{' '}
                                {remainingCapacity}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 overflow-x-hidden">
                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={cn(
                                'border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors',
                                isDragActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                                remainingCapacity === 0 && 'opacity-50'
                            )}
                        >
                            <input {...getInputProps()} />

                            <div className="flex flex-col items-center gap-3">
                                <Upload className="h-10 w-10 text-muted-foreground" />

                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium">
                                        {isDragActive ? 'Drop the files here' : 'Drag & drop images here'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, WebP up to 4MB.
                                        {remainingCapacity === 0 ? (
                                            <span className="block mt-1">
                                                Limit reached ({MAX_PER_UPLOAD}). Remove one to add more.
                                            </span>
                                        ) : (
                                            <span className="block mt-1">
                                                You can add {remainingCapacity} more.
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        open();
                                    }}
                                    disabled={remainingCapacity === 0 || isUploading}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Add images
                                </Button>
                            </div>
                        </div>

                        {/* Selected images (grid) */}
                        {hasImages && (
                            <>
                                {displayMode === 'carousel' ? (
                                    <ImageCarousel
                                        images={images}
                                        onRemove={onImageRemove}
                                        isUploading={isUploading}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {images.map((image) => (
                                            <div
                                                key={image.id}
                                                className="relative border rounded-lg p-2 overflow-hidden"
                                            >
                                                {/* Remove button is inside the tile; you can remove again. */}
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    onClick={() => onImageRemove(image.id)}
                                                    disabled={isUploading}
                                                    className="absolute right-1 top-1 h-7 w-7 z-20"
                                                    aria-label={`Remove ${image.file.name}`}
                                                >
                                                    {/* Use a simple X icon via lucide if you want; keeping existing imports minimal. */}
                                                    <span className="text-xs leading-none">✕</span>
                                                </Button>

                                                <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                                                    {/* If you were seeing “can’t remove”, it’s usually because the button sat under the fill image.
                            z-20 above + tile overflow-hidden fixes that. */}
                                                    {/* We’re not importing next/image here to keep this file self-contained. If you prefer next/image
                            in grid mode too, swap in <Image ... fill ... /> like earlier. */}
                                                    <img
                                                        src={image.preview}
                                                        alt={image.file.name}
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="mt-2 w-full min-w-0">
                                                    <div className="flex items-start gap-2 min-w-0">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium truncate">
                                                                {image.file.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(image.file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>

                                                        <div className="flex-shrink-0 pt-0.5">
                                                            {image.status === 'pending' && (
                                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                            {image.status === 'uploading' && (
                                                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                                            )}
                                                            {image.status === 'success' && (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            )}
                                                            {image.status === 'error' && (
                                                                <AlertCircle className="h-4 w-4 text-destructive" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {image.status === 'uploading' && (
                                                        <div className="mt-2">
                                                            <Progress value={image.progress} className="h-1.5" />
                                                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                                                {image.progress}% - Transcoding & uploading...
                                                            </p>
                                                        </div>
                                                    )}

                                                    {image.status === 'error' && (
                                                        <Alert variant="destructive" className="mt-2">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertDescription className="text-xs">
                                                                {image.errorMessage}
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isUploading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>

                            {hasImages && (
                                <Button
                                    type="button"
                                    onClick={onUpload}
                                    disabled={!canUpload}
                                    className="flex-1"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : allUploaded ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            All Uploaded
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload {images.length} Image{images.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rejection AlertDialog (no inline alerts in the modal) */}
            <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
                <AlertDialogContent className="max-w-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {rejectionState?.message ?? 'Cannot insert images.'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-muted-foreground text-sm'>Error details and file list below.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='text-muted-foreground text-sm'>
                        {rejectionState?.files?.length ? (
                            <div className="mt-2 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    The following file{rejectionState.files.length !== 1 ? 's' : ''}{' '}
                                    could not be added:
                                </p>
                                <div className="max-h-[90dvh] overflow-y-auto rounded-md border p-3">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {rejectionState.files.map((name) => (
                                            <li key={name} className="break-words text-sm">
                                                <span className="font-medium">{name}</span>
                                                {rejectionState.reasons?.[name] ? (
                                                    <span className="text-muted-foreground">
                                                        {' '}
                                                        — {rejectionState.reasons[name]}
                                                    </span>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-2">
                                No additional details available.
                            </p>
                        )}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setRejectionDialogOpen(false)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
