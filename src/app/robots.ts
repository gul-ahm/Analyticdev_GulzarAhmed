import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const aiAndSearchBots = [
        'OAI-SearchBot',
        'ChatGPT-User',
        'Claude-SearchBot',
        'Claude-User',
        'PerplexityBot',
        'Perplexity-User',
        'Googlebot',
        'bingbot',
        'GPTBot',
        'ClaudeBot',
        'Google-Extended',
        'Applebot-Extended',
    ];

    return {
        rules: [
            {
                userAgent: aiAndSearchBots,
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://analyticsdev.xyz/sitemap.xml',
    };
}

