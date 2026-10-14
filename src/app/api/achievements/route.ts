import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as achievementRepo from '@/lib/repositories/achievement.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const achievements = await achievementRepo.findAllAchievements();
        return NextResponse.json({ success: true, data: achievements }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch achievements' }, { status: 500 });
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
        const achievement = await achievementRepo.createAchievement(body);

        return NextResponse.json({ success: true, data: achievement }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create achievement' }, { status: 500 });
    }
}
