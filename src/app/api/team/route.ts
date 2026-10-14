import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as teamRepo from '@/lib/repositories/team.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const members = await teamRepo.findAllTeamMembers();
        return NextResponse.json({ success: true, data: members }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch team members' },
            { status: 500 }
        );
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

        // 1. Generate Slug
        const baseSlug = body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        const slug = `${baseSlug}-${Date.now()}`; // Ensure uniqueness

        // 2. Map Payload to Interface
        const insertData = {
            name: body.name,
            slug: slug,
            position: body.role || body.position, // Handle role/position mapping
            bio: body.bio,
            image: body.image,
            displayOrder: body.order,
            quote: body.quote,
            headline: body.headline,
            socialLinks: body.socialLinks
        };

        const member = await teamRepo.createTeamMember(insertData);

        return NextResponse.json({ success: true, data: member }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create team member' },
            { status: 500 }
        );
    }
}
