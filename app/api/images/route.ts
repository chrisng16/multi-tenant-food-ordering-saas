import { db } from "@/db";
import { images } from "@/db/schema";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Create image metadata
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { storeId, productId, tag, filename, url, key, size, mimeType } = body;

        if (!storeId || !tag || !filename || !url || !key || !size || !mimeType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const [image] = await db
            .insert(images)
            .values({
                storeId,
                productId: productId || null,
                tag,
                filename,
                url,
                key,
                size,
                mimeType,
            })
            .returning();

        return NextResponse.json(image);
    } catch (error) {
        console.error("Error saving image metadata:", error);
        return NextResponse.json(
            { error: "Failed to save image metadata" },
            { status: 500 }
        );
    }
}

// Delete image
export async function DELETE(request: NextRequest) {
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json(
                { error: "Missing key" },
                { status: 400 }
            );
        }

        // Delete from S3
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
        });
        await s3Client.send(deleteCommand);

        // Delete from database
        await db.delete(images).where(eq(images.key, key));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}
