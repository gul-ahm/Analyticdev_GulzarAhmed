import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as pageRepo from '@/lib/repositories/page.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const page = await pageRepo.findPageById(parseInt(id));

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const page = await pageRepo.updatePage(parseInt(id), body);

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message || 'Failed to update page' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;

        const page = await pageRepo.findPageById(parseInt(id));
        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }

        await pageRepo.deletePage(parseInt(id));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete page' }, { status: 500 });
    }
}
