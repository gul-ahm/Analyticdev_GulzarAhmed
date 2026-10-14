// Renders the markdown an article is written in. Headings carry ids that match
// the contents list, and links out of the site are marked rel="nofollow" so a
// citation in an article never leaks ranking weight by accident.

import ReactMarkdown from 'react-markdown';
import { headingId } from '@/lib/article-seo';

function textOf(children: React.ReactNode): string {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(textOf).join('');
    if (children && typeof children === 'object' && 'props' in (children as any)) {
        return textOf((children as any).props?.children);
    }
    return '';
}

export default function ArticleBody({ content }: { content: string }) {
    return (
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-slate-900 prose-a:underline prose-a:decoration-slate-300 prose-a:underline-offset-4 hover:prose-a:decoration-slate-900 prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-pre:bg-slate-900 prose-pre:text-slate-100">
            <ReactMarkdown
                components={{
                    h2: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
                    h3: ({ children }) => <h3 id={headingId(textOf(children))}>{children}</h3>,
                    a: ({ href, children }) => {
                        const external = !!href && /^https?:\/\//i.test(href) && !href.includes('analyticsdev.xyz');
                        return (
                            <a
                                href={href}
                                {...(external
                                    ? { target: '_blank', rel: 'nofollow noopener noreferrer' }
                                    : {})}
                            >
                                {children}
                            </a>
                        );
                    },
                    img: ({ src, alt }) =>
                        typeof src === 'string' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={alt || ''} loading="lazy" decoding="async" />
                        ) : null
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
