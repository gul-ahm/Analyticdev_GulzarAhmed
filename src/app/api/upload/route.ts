import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '@/lib/session';

export async function POST(req: Request) {
    try {
        // 1. Authentication Check & Role Logic
        const user = await getCurrentUser();
        const isAdmin = user && user.role === 'admin';

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 3. Security Check: File Type vs User Role
        // SVGs are STRICTLY Admin only
        if (file.type === 'image/svg+xml') {
            if (!isAdmin) {
                return NextResponse.json({ error: 'Unauthorized: SVG uploads require Admin privileges.' }, { status: 403 });
            }
        }

        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
            'video/mp4', 'video/webm', 'video/ogg'
        ];

        // 3.1 Basic MIME check (Fast fail)
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: `Invalid file type: ${file.type}.` }, { status: 400 });
        }

        // 30MB limit
        if (file.size > 30 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 30MB.' }, { status: 400 });
        }

        // 4. Prepare File Buffer & Sanitize
        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes);

        // 4.1 BRUTAL SECURITY: Magic Number Validation (Prevent Spoofing)
        // Checks binary signature against MIME type
        const { validateFileSignature } = require('@/lib/security');

        const isValidSignature = validateFileSignature(buffer, file.type);

        if (!isValidSignature) {
            const header = buffer.toString('hex', 0, 4);
            console.error(`Security Alert: Malformed file header for ${file.type}. Header: ${header}`);
            return NextResponse.json({ error: 'Security Warning: File header does not match extension (Potential Spoofing).' }, { status: 400 });
        }

        // SVG Sanitization (Even for admins, we sanitize)
        if (file.type === 'image/svg+xml') {
            try {
                const DOMPurify = require('isomorphic-dompurify');
                const textContent = buffer.toString('utf-8');
                const sanitized = DOMPurify.sanitize(textContent);
                buffer = Buffer.from(sanitized, 'utf-8');
            } catch (err) {
                console.error('SVG Sanitization failed:', err);
                return NextResponse.json({ error: 'Failed to sanitize SVG file' }, { status: 400 });
            }
        }

        // 5. Prepare Directory
        // Ensure public/uploads exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Ignore if exists
        }

        // 6. Generate Filename & Save
        const timestamp = Date.now();
        // Sanitize filename: remove spaces, special chars
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeName}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // 7. Return Public URL
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
