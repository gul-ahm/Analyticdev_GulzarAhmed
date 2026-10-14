import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as pageRepo from '@/lib/repositories/page.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const pages = await pageRepo.findAllPages();
        return NextResponse.json({ success: true, data: pages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch pages' }, { status: 500 });
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
        const page = await pageRepo.createPage(body);

        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message || 'Failed to create page' }, { status: 500 });
    }
}
