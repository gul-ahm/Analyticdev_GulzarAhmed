import Link from 'next/link';
import * as pageRepo from '@/lib/repositories/page.repository';
import * as reviewRepo from '@/lib/repositories/review.repository';
import CrowdCanvas from '@/components/ui/CrowdCanvas';
import ReviewGlassWall from '@/components/public/ReviewGlassWall';

// Open Peeps sprite sheet (CC0). Swap for a local copy in /public when you have one.
const PEEPS_SPRITE = 'https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reviews | Analytics Dev',
    description: 'Reviews from people I have worked with, published exactly as they wrote them.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/reviews',
    },
    openGraph: {
        title: 'Reviews | Analytics Dev',
        description: 'Reviews from people I have worked with, published exactly as they wrote them.',
        url: 'https://analyticsdev.xyz/reviews',
        type: 'website',
    },
};

const reviewsSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "ItemPage",
            "@id": "https://analyticsdev.xyz/reviews#webpage",
            "url": "https://analyticsdev.xyz/reviews",
            "name": "Analytics Dev Client Reviews and Testimonials",
            "description": "Verified client reviews and delivery track record for Analytics Dev.",
            "mainEntity": {
                "@id": "https://analyticsdev.xyz/#organization"
            }
        }
    ]
};

export const dynamic = 'force-dynamic';

async function getReviewsData() {
    const [page, reviews] = await Promise.all([
        pageRepo.findPageBySlug('reviews').catch(() => null),
        reviewRepo.findAllReviews(true).catch(() => [])
    ]);
    return {
        content: page?.content || {},
        reviews: reviews || []
    };
}

export default async function ExperienceAndReviewsPage() {
    const { content, reviews } = await getReviewsData();

    return (
        <div className="bg-slate-50 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
            />
            {/* Header: the people whose words fill this page, walking past below */}
            <div className="relative md:sticky md:top-0 z-0 isolate h-[100dvh] w-full overflow-hidden bg-white pt-36">
                <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">
                    <h1 className="max-w-2xl text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                        {content.headline || 'In their words.'}
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-slate-600 leading-relaxed">
                        {content.subtext || 'Reviews from people I have worked with, published exactly as they wrote them. If the list is short, that is because I only put real ones here.'}
                    </p>
                </div>

                <CrowdCanvas
                    src={PEEPS_SPRITE}
                    rows={15}
                    cols={7}
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%] w-full"
                />
            </div>

            {/* The reviews themselves, drawn as panels behind the lens */}
            <div className="relative md:sticky md:top-0 md:min-h-[100dvh] flex flex-col justify-center z-10 bg-white rounded-t-[2.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] pt-10 pb-20">
                {reviews.length > 0 ? (
                    <ReviewGlassWall reviews={reviews} />
                ) : (
                    <div className="max-w-xl mx-auto px-6 py-24 text-center">
                        <p className="text-slate-500">
                            No reviews published yet. When a client signs off, I ask for a few
                            lines and their permission to use their name, and it goes here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
