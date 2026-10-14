import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as serviceRepo from '@/lib/repositories/service.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        // Redundant dbConnect check removed.
        // Repository functions handle connection acquisition and errors better.


        const services = await serviceRepo.findAllServices();
        return NextResponse.json({ success: true, data: services }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch services' },
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
        const service = await serviceRepo.createService(body);

        return NextResponse.json({ success: true, data: service }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create service' },
            { status: 500 }
        );
    }
}
