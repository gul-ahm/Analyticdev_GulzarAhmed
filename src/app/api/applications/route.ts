import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as applicationRepo from '@/lib/repositories/application.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const applications = await applicationRepo.findAllApplications();
        return NextResponse.json({ success: true, data: applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
    }
}

import { applicationSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Zod Validation
        const validation = applicationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const application = await applicationRepo.createApplication({
            ...validation.data,
            job: parseInt(validation.data.job) // Convert string to number
        });

        return NextResponse.json({ success: true, data: application }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create application' }, { status: 500 });
    }
}
