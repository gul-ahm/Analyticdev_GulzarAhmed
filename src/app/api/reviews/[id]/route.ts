import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as reviewRepo from '@/lib/repositories/review.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const review = await reviewRepo.findReviewById(parseInt(id));

        if (!review) {
            return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch review' }, { status: 500 });
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
        const review = await reviewRepo.updateReview(parseInt(id), body);

        if (!review) {
            return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update review' }, { status: 500 });
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

        const review = await reviewRepo.findReviewById(parseInt(id));
        if (!review) {
            return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
        }

        await reviewRepo.deleteReview(parseInt(id));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
    }
}
