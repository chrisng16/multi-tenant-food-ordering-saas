import { generatePresignedUrl } from '@/lib/aws/s3';
import { NextRequest, NextResponse } from 'next/server';
// Import your auth library
// import { getServerSession } from 'next-auth';

const ALLOWED_CONTENT_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/avif',
];

const ALLOWED_FOLDERS = ['products', 'logos', 'profiles'];

export async function POST(request: NextRequest) {
    try {
        // Get authenticated user and tenant
        // const session = await getServerSession();
        // if (!session) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        // const tenantId = session.user.tenantId;

        // For demo purposes, get tenantId from request
        const body = await request.json();
        console.log('Request body:', body);
        const { filename, contentType, storeId, folder = 'products' } = body;

        // Validation
        if (!storeId || typeof storeId !== 'string') {
            return NextResponse.json(
                { error: 'Store ID is required' },
                { status: 400 }
            );
        }

        if (!filename || typeof filename !== 'string') {
            return NextResponse.json(
                { error: 'Filename is required' },
                { status: 400 }
            );
        }

        if (!contentType || typeof contentType !== 'string') {
            return NextResponse.json(
                { error: 'Content type is required' },
                { status: 400 }
            );
        }

        if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
            return NextResponse.json(
                { error: 'Invalid content type. Only images are allowed.' },
                { status: 400 }
            );
        }

        if (!ALLOWED_FOLDERS.includes(folder)) {
            return NextResponse.json(
                { error: 'Invalid folder type.' },
                { status: 400 }
            );
        }

        // Generate presigned URL for this tenant
        const { uploadUrl, fileUrl, key } = await generatePresignedUrl(
            storeId,
            filename,
            contentType,
            folder,
            3600
        );

        return NextResponse.json({
            uploadUrl,
            fileUrl,
            key,
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
}