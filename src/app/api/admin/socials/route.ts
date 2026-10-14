import { NextRequest, NextResponse } from 'next/server';
import * as socialRepo from '@/lib/repositories/social.repository';
import { ISocialLinkInsert } from '@/models/SocialLink';

export async function GET() {
    try {
        const links = await socialRepo.findAllSocialLinks(false); // All links
        return NextResponse.json(links);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newLink = await socialRepo.createSocialLink(body as ISocialLinkInsert);
        return NextResponse.json(newLink, { status: 201 });
    } catch (error) {
        console.error('Error creating social link:', error);
        return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
    }
}
