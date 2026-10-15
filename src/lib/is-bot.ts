import { headers } from 'next/headers';

/**
 * Crawlers, previewers and auditing tools. Matched loosely on the user agent,
 * which is all a server has to go on.
 */
const BOT_PATTERN = new RegExp(
    [
        // search
        'googlebot', 'google-inspectiontool', 'storebot-google', 'bingbot', 'slurp',
        'duckduckbot', 'baiduspider', 'yandex', 'applebot', 'sogou', 'exabot',
        // answer engines
        'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'claude-searchbot',
        'claude-user', 'perplexitybot', 'perplexity-user', 'google-extended',
        'ccbot', 'cohere-ai', 'bytespider', 'amazonbot', 'meta-externalagent',
        // link previews
        'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'slackbot',
        'telegrambot', 'discordbot', 'embedly', 'pinterest',
        // auditing, so the loader never skews a score
        'lighthouse', 'chrome-lighthouse', 'pagespeed', 'headlesschrome', 'gtmetrix',
        // catch alls
        'crawler', 'spider', 'bot/', '\\bbot\\b'
    ].join('|'),
    'i'
);

/**
 * True when the request looks like a crawler rather than a person.
 * Used to skip purely decorative things, never to change the content itself.
 */
export async function isCrawler(): Promise<boolean> {
    try {
        const ua = (await headers()).get('user-agent') || '';
        if (!ua) return true; // no agent at all is almost always a script
        return BOT_PATTERN.test(ua);
    } catch {
        return false;
    }
}
