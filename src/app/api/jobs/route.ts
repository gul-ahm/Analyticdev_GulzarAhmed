import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as jobRepo from '@/lib/repositories/job.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const jobs = await jobRepo.findAllJobs();
        return NextResponse.json({ success: true, data: jobs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
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
        const job = await jobRepo.createJob(body);

        return NextResponse.json({ success: true, data: job }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message || 'Failed to create job' }, { status: 500 });
    }
}
