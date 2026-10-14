import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as reviewRepo from '@/lib/repositories/review.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        // Redundant dbConnect check removed.
        // Repository functions handle connection acquisition and errors better.


        const reviews = await reviewRepo.findAllReviews();
        return NextResponse.json({ success: true, data: reviews }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
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
        const review = await reviewRepo.createReview(body);

        return NextResponse.json({ success: true, data: review }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create review' }, { status: 500 });
    }
}
