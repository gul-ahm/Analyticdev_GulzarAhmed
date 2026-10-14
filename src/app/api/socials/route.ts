import { NextResponse } from 'next/server';
import * as socialRepo from '@/lib/repositories/social.repository';

export async function GET() {
    try {
        const links = await socialRepo.findAllSocialLinks(true); // Only active links
        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
    }
}
