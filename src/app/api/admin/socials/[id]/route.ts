import { NextRequest, NextResponse } from 'next/server';
import * as socialRepo from '@/lib/repositories/social.repository';

// Correctly type the params argument
type Props = {
    params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await req.json();
        const updatedLink = await socialRepo.updateSocialLink(parseInt(id), body);
        return NextResponse.json(updatedLink);
    } catch (error) {
        console.error('Error updating social link:', error);
        return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        await socialRepo.deleteSocialLink(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting social link:', error);
        return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
    }
}
