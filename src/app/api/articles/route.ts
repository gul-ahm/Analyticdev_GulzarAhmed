import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as articleRepo from '@/lib/repositories/article.repository';
import { getCurrentUser } from '@/lib/session';
import { toSlug } from '@/models/Article';

/** Admins see everything, everyone else sees published articles only. */
export async function GET() {
    try {
        const conn = await dbConnect();
        if (!conn) return NextResponse.json({ success: true, data: [] }, { status: 200 });

        const user = await getCurrentUser();
        const data =
            user && user.role === 'admin'
                ? await articleRepo.findAllArticles()
                : await articleRepo.findPublishedArticles();

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch articles' },
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

        if (!body.title || !String(body.title).trim()) {
            return NextResponse.json({ success: false, error: 'A title is required' }, { status: 400 });
        }

        let slug = toSlug(body.slug || body.title);
        if (!slug) slug = `article-${Date.now()}`;
        if (await articleRepo.slugTaken(slug)) {
            slug = `${slug}-${Date.now().toString().slice(-5)}`;
        }

        const article = await articleRepo.createArticle({
            title: String(body.title).trim(),
            slug,
            excerpt: body.excerpt || '',
            content: body.content || '',
            coverImage: body.coverImage,
            coverAlt: body.coverAlt,
            category: body.category,
            tags: Array.isArray(body.tags) ? body.tags : [],
            takeaways: Array.isArray(body.takeaways) ? body.takeaways : [],
            faq: Array.isArray(body.faq) ? body.faq : [],
            seoTitle: body.seoTitle,
            seoDescription: body.seoDescription,
            status: body.status === 'published' ? 'published' : 'draft'
        });

        return NextResponse.json({ success: true, data: article }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { success: false, error: 'That slug is already in use' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create article' },
            { status: 500 }
        );
    }
}
