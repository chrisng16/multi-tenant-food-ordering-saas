export type ImageTag = "logo" | "product" | "banner" | "profile";

export interface UploadedImage {
    id: string;
    url: string;
    key: string;
    filename: string;
    size: number;
    mimeType: string;
    preview?: string; // For local preview before upload
}

export interface PendingImagePreview {
    file: File;
    preview: string;
}