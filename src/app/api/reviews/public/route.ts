import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as reviewRepo from '@/lib/repositories/review.repository';

import { reviewSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        await dbConnect();
        // ... inside POST ...
        const body = await req.json();

        // Zod Validation
        const validation = reviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }
        const data = validation.data;

        // Force 'featured' to false for public submissions (Moderation Queue)
        const reviewData = {
            clientName: data.name,
            position: data.role ? (data.company ? `${data.role} at ${data.company}` : data.role) : (data.company || ''),
            content: data.content,
            rating: data.rating,
            image: data.image || undefined, // Use undefined instead of null
            featured: true, // INSTANT PUBLISH as requested
        };

        const review = await reviewRepo.createReview(reviewData);

        return NextResponse.json({ success: true, data: review }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create review' },
            { status: 500 }
        );
    }
}
