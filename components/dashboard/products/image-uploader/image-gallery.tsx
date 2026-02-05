import { Button } from '@/components/ui/button';
import { ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    onDelete: (url: string) => void;
}

export function ImageGallery({ images, onDelete }: ImageGalleryProps) {
    if (images.length === 0) {
        return (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((url, index) => (
                <div
                    key={url}
                    className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
                >
                    <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete(url)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}