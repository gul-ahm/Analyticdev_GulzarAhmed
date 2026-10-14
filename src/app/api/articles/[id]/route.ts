import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as articleRepo from '@/lib/repositories/article.repository';
import { getCurrentUser } from '@/lib/session';
import { toSlug } from '@/models/Article';

async function requireAdmin() {
    const user = await getCurrentUser();
    return !!user && user.role === 'admin';
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const { id } = await params;
        const article = await articleRepo.findArticleById(parseInt(id, 10));
        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: article }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to fetch article' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const { id } = await params;
        const articleId = parseInt(id, 10);
        const body = await req.json();

        const patch: any = {};
        if (body.title !== undefined) patch.title = String(body.title).trim();
        if (body.excerpt !== undefined) patch.excerpt = body.excerpt;
        if (body.content !== undefined) patch.content = body.content;
        if (body.coverImage !== undefined) patch.coverImage = body.coverImage;
        if (body.coverAlt !== undefined) patch.coverAlt = body.coverAlt;
        if (body.category !== undefined) patch.category = body.category;
        if (body.tags !== undefined) patch.tags = Array.isArray(body.tags) ? body.tags : [];
        if (body.takeaways !== undefined) patch.takeaways = Array.isArray(body.takeaways) ? body.takeaways : [];
        if (body.faq !== undefined) patch.faq = Array.isArray(body.faq) ? body.faq : [];
        if (body.seoTitle !== undefined) patch.seoTitle = body.seoTitle;
        if (body.seoDescription !== undefined) patch.seoDescription = body.seoDescription;
        if (body.status !== undefined) patch.status = body.status === 'published' ? 'published' : 'draft';

        if (body.slug !== undefined) {
            const slug = toSlug(body.slug);
            if (!slug) {
                return NextResponse.json({ success: false, error: 'That slug is empty' }, { status: 400 });
            }
            if (await articleRepo.slugTaken(slug, articleId)) {
                return NextResponse.json(
                    { success: false, error: 'Another article already uses that slug' },
                    { status: 400 }
                );
            }
            patch.slug = slug;
        }

        const article = await articleRepo.updateArticle(articleId, patch);
        return NextResponse.json({ success: true, data: article }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json({ success: false, error: 'That slug is already in use' }, { status: 400 });
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update article' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const { id } = await params;
        await articleRepo.deleteArticle(parseInt(id, 10));
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
    }
}
