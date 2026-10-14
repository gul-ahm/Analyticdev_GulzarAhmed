import * as articleRepo from '@/lib/repositories/article.repository';
import { SITE_URL, AUTHOR_NAME, articleUrl } from '@/lib/article-seo';

export const dynamic = 'force-dynamic';

function escapeXml(value: string) {
    return (value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** RSS, so readers and aggregators pick up new posts without crawling. */
export async function GET() {
    const articles = await articleRepo.findPublishedArticles(50).catch(() => []);
    const updated = articles[0]?.publishedAt
        ? new Date(articles[0].publishedAt).toUTCString()
        : new Date().toUTCString();

    const items = articles
        .map((article) => {
            const url = articleUrl(article.slug);
            return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <dc:creator>${escapeXml(AUTHOR_NAME)}</dc:creator>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : updated}</pubDate>
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Analytics Dev Notes</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on building websites, web applications and AI systems, from a one engineer studio in Mumbai.</description>
    <language>en</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=600, s-maxage=600'
        }
    });
}
