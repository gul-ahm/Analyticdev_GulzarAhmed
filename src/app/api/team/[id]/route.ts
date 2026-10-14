import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as teamRepo from '@/lib/repositories/team.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const member = await teamRepo.findTeamMemberById(parseInt(id));

        if (!member) {
            return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: member }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch team member' }, { status: 500 });
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

        // Map order to displayOrder if present
        if (body.order !== undefined) {
            body.displayOrder = body.order;
        }
        if (body.quote !== undefined) {
            body.quote = body.quote;
        }
        if (body.headline !== undefined) {
            body.headline = body.headline;
        }

        const member = await teamRepo.updateTeamMember(parseInt(id), body);

        if (!member) {
            return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: member }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message || 'Failed to update team member' }, { status: 500 });
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

        const member = await teamRepo.findTeamMemberById(parseInt(id));
        if (!member) {
            return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
        }

        await teamRepo.deleteTeamMember(parseInt(id));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
    }
}
