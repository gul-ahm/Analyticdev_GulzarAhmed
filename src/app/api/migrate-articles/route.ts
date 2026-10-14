import { NextResponse } from 'next/server';
import { execute } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/session';

/**
 * Creates the articles table. Safe to run more than once.
 * Visit /api/migrate-articles while signed in as admin.
 */
export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await execute(`
            CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                excerpt TEXT,
                content LONGTEXT,
                cover_image VARCHAR(512) NULL,
                cover_alt VARCHAR(255) NULL,
                category VARCHAR(120) NULL,
                tags JSON NULL,
                takeaways JSON NULL,
                faq JSON NULL,
                seo_title VARCHAR(255) NULL,
                seo_description VARCHAR(400) NULL,
                status ENUM('draft','published') NOT NULL DEFAULT 'draft',
                published_at DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_articles_status_date (status, published_at),
                INDEX idx_articles_slug (slug)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        return NextResponse.json({ success: true, message: 'articles table is ready' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Migration failed' },
            { status: 500 }
        );
    }
}
