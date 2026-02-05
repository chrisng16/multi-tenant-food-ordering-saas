// ImageCarousel.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
    s3Url?: string;
}

export function ImageCarousel({
    images,
    onRemove,
    isUploading,
    className,
}: {
    images: ImageFile[];
    onRemove: (id: string) => void;
    isUploading: boolean;
    className?: string;
}) {
    const [index, setIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const count = images.length;

    // Keep index valid when items are removed (including removing the last item)
    useEffect(() => {
        if (count === 0) {
            setIndex(0);
            return;
        }
        setIndex((prev) => Math.min(prev, count - 1));
    }, [count]);

    const goTo = useCallback(
        (next: number) => {
            if (count === 0) return;

            const clamped = Math.max(0, Math.min(count - 1, next));
            setIndex(clamped);

            const el = containerRef.current;
            if (!el) return;

            const child = el.children.item(clamped) as HTMLElement | null;
            child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        },
        [count]
    );

    // IMPORTANT: guard before reading current.file when count can be 0.
    if (count === 0) return null;

    const safeIndex = Math.min(Math.max(index, 0), count - 1);
    const current = images[safeIndex];

    const prevDisabled = safeIndex <= 0;
    const nextDisabled = safeIndex >= count - 1;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{current.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {safeIndex + 1} / {count} • {(current.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => goTo(safeIndex - 1)}
                        disabled={prevDisabled}
                    >
                        Prev
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => goTo(safeIndex + 1)}
                        disabled={nextDisabled}
                    >
                        Next
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(current.id)}
                        disabled={isUploading}
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>

            {/* Scroll-snap carousel */}
            <div
                ref={containerRef}
                className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-px-4"
            >
                {images.map((img, i) => {
                    const active = i === safeIndex;

                    return (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => goTo(i)}
                            className={cn(
                                'relative snap-center flex-shrink-0 w-[120px] aspect-square rounded-lg overflow-hidden border bg-muted focus:outline-none',
                                active ? 'border border-primary' : 'hover:border-muted-foreground/50'
                            )}
                            aria-label={`Select ${img.file.name}`}
                        >
                            <Image
                                src={img.preview}
                                alt={img.file.name}
                                fill
                                sizes="(max-width: 640px) 120px, 120px"
                                className="object-cover"
                            />

                            {/* Status badge */}
                            <div className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs flex items-center gap-1">
                                {img.status === 'uploading' && (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Uploading {img.progress}%
                                    </>
                                )}
                                {img.status === 'success' && (
                                    <>
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        Uploaded
                                    </>
                                )}
                                {img.status === 'error' && (
                                    <>
                                        <AlertCircle className="h-3 w-3 text-destructive" />
                                        Error
                                    </>
                                )}
                                {img.status === 'pending' && 'Pending'}
                            </div>

                            {/* Error message (clamped) */}
                            {img.status === 'error' && img.errorMessage && (
                                <div className="absolute left-2 right-2 bottom-2 rounded-md bg-destructive/90 text-destructive-foreground px-2 py-1 text-xs">
                                    <p className="line-clamp-2">{img.errorMessage}</p>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
