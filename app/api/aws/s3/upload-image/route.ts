import { uploadToS3 } from '@/lib/aws/s3';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
const ALLOWED_FOLDERS = ['products', 'logos', 'profiles'];

export async function POST(request: NextRequest) {
    try {
        // Get authenticated tenant
        // const session = await getServerSession();
        // if (!session) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        // const tenantId = session.user.tenantId;

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const tenantId = formData.get('tenantId') as string; // From form or session
        const folder = (formData.get('folder') as string) || 'products';

        // Validation
        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
        }

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images are allowed.' },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 400 }
            );
        }

        if (!ALLOWED_FOLDERS.includes(folder)) {
            return NextResponse.json(
                { error: 'Invalid folder type.' },
                { status: 400 }
            );
        }

        // Convert to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to tenant-specific folder
        const fileUrl = await uploadToS3(tenantId, buffer, file.name, file.type, folder);

        return NextResponse.json({
            url: fileUrl,
            filename: file.name,
            size: file.size,
            type: file.type,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload file' },
            { status: 500 }
        );
    }
}