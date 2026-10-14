import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import dbConnect from '@/lib/db';
import * as projectRepo from '@/lib/repositories/project.repository';
import { getCurrentUser } from '@/lib/session';

// GET Single Project
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const project = await projectRepo.findProjectById(parseInt(id));

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

// UPDATE Project
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const project = await projectRepo.updateProject(parseInt(id), body);

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error: any) {
        // MySQL duplicate entry error
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update project' },
            { status: 500 }
        );
    }
}

// DELETE Project
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;

        // Check if project exists first
        const project = await projectRepo.findProjectById(parseInt(id));
        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        // CLEANUP: Delete orphaned image files from storage
        if (project.images && Array.isArray(project.images)) {
            const publicDir = join(process.cwd(), 'public');

            for (const imageUrl of project.images) {
                // Only delete local uploads (starting with /uploads/)
                if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads/')) {
                    try {
                        // imageUrl is like /uploads/filename.jpg, so join(public, imageUrl) works perfectly
                        // e.g. E:\proj\public + \uploads\file.jpg
                        const fullPath = join(publicDir, imageUrl);
                        await unlink(fullPath);
                        console.log(`[Auto-Cleanup] Deleted file: ${fullPath}`);
                    } catch (err) {
                        console.warn(`[Auto-Cleanup] Skipped missing file: ${imageUrl}`);
                    }
                }
            }
        }

        await projectRepo.deleteProject(parseInt(id));

        return NextResponse.json(
            { success: true, data: {} },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
