import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as projectRepo from '@/lib/repositories/project.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        // Redundant dbConnect check removed.
        // Repository functions handle connection acquisition and errors better.


        const projects = await projectRepo.findAllProjects();

        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();

        const project = await projectRepo.createProject(body);

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        // MySQL duplicate entry error
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}
