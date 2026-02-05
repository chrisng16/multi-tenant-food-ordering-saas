import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPathActive(pathname: string, href: string) {
  // Normalize: remove trailing slash (except root)
  const normalize = (s: string) =>
    s.length > 1 ? s.replace(/\/dashboard/g, "").replace(/\//g, "") : s;

  const pathLastTwoSegments = pathname.split("/").slice(-2).join("")

  const p = normalize(pathLastTwoSegments)
  const h = normalize(href)

  // Check if pathname contains the href (simple substring match for "products" use case)
  return p.includes(h)
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Transcode and optimize an image file
 * Tries AVIF first, then WebP, then JPEG as fallback
 */
export async function transcodeImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = async () => {
      // Calculate new dimensions (max 1920px while maintaining aspect ratio)
      const MAX_DIMENSION = 1920;
      let width = img.width;
      let height = img.height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = (height / width) * MAX_DIMENSION;
          width = MAX_DIMENSION;
        } else {
          width = (width / height) * MAX_DIMENSION;
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      onProgress?.(30);

      // Try AVIF first (best compression)
      try {
        const avifBlob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((blob) => res(blob), 'image/avif', 0.85);
        });

        if (avifBlob && avifBlob.size < file.size) {
          onProgress?.(100);
          resolve(avifBlob);
          return;
        }
      } catch (e) {
        console.log('AVIF not supported, falling back to WebP');
      }

      onProgress?.(60);

      // Try WebP
      try {
        const webpBlob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((blob) => res(blob), 'image/webp', 0.85);
        });

        if (webpBlob && webpBlob.size < file.size) {
          onProgress?.(100);
          resolve(webpBlob);
          return;
        }
      } catch (e) {
        console.log('WebP not supported, falling back to JPEG');
      }

      onProgress?.(80);

      // Fallback to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onProgress?.(100);
            resolve(blob);
          } else {
            reject(new Error('Failed to create JPEG blob'));
          }
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export const removeExtension = (filename: string) => {
  return filename.replace(/\.[^/.]+$/, "");
};
