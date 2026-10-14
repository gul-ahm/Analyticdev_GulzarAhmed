import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as contactRepo from '@/lib/repositories/contact.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const contact = await contactRepo.findContactSubmissionById(parseInt(id));

        if (!contact) {
            return NextResponse.json({ success: false, error: 'Contact submission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: contact }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch contact submission' }, { status: 500 });
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

        const contact = await contactRepo.findContactSubmissionById(parseInt(id));
        if (!contact) {
            return NextResponse.json({ success: false, error: 'Contact submission not found' }, { status: 404 });
        }

        await contactRepo.deleteContactSubmission(parseInt(id));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete contact submission' }, { status: 500 });
    }
}
