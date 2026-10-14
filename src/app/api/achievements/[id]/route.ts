import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as achievementRepo from '@/lib/repositories/achievement.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const achievement = await achievementRepo.findAchievementById(parseInt(id));

        if (!achievement) {
            return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: achievement }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch achievement' }, { status: 500 });
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
        const achievement = await achievementRepo.updateAchievement(parseInt(id), body);

        if (!achievement) {
            return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: achievement }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update achievement' }, { status: 500 });
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

        const achievement = await achievementRepo.findAchievementById(parseInt(id));
        if (!achievement) {
            return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 });
        }

        await achievementRepo.deleteAchievement(parseInt(id));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete achievement' }, { status: 500 });
    }
}
