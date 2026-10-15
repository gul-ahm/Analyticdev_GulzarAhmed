import Link from 'next/link';
import * as pageRepo from '@/lib/repositories/page.repository';
import ScrollReveal from '@/components/public/ScrollReveal';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import MurmurationWordmark from '@/components/ui/MurmurationWordmark';
import ReviewForm from '@/components/public/ReviewForm';
import { AboutFacts, AboutPath, AboutFit } from '@/components/public/AboutSections';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Analytics Dev | One-Engineer Studio in Mumbai',
    description: 'Analytics Dev is Gulzar Ahmed, a one-engineer web and AI studio in Mumbai. Work delivered across construction, healthcare supply, retail, real estate and education.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/about',
    },
    openGraph: {
        title: 'About Analytics Dev | One-Engineer Studio in Mumbai',
        description: 'A one-engineer web and AI studio in Mumbai. The number is agreed before the work starts, and the code is yours from day one.',
        url: 'https://analyticsdev.xyz/about',
        type: 'website',
    },
};

const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "AboutPage",
            "@id": "https://analyticsdev.xyz/about#webpage",
            "url": "https://analyticsdev.xyz/about",
            "name": "About Analytics Dev",
            "description": "Founder-led web development and production AI systems studio in Mumbai, India.",
            "mainEntity": {
                "@id": "https://analyticsdev.xyz/#organization"
            }
        }
    ]
};

async function getAboutData() {
    const page = await pageRepo.findPageBySlug('about').catch(() => null);
    return {
        content: page?.content || {}
    };
}

const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
        </span>
    ));
};

export default async function AboutPage() {
    const { content } = await getAboutData();

    return (
        <div className="bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />

            {/* 1. HERO — the flock spells the studio name */}
            <MurmurationWordmark
                word="ANALYTICSDEV"
                height="100svh"
                palette={{ skyTop: '#f8fafc', skyLow: '#e2e8f0', sun: '#ffffff', ink: '#0f172a' }}
            >
                <div className="flex h-full flex-col justify-between px-6 pb-28 pt-28 lg:px-8">
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <span className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-900 ring-1 ring-inset ring-slate-900/10 backdrop-blur-sm">
                            {content.hero_label || 'About'}
                        </span>
                        <span className="rounded-full border border-slate-300/60 bg-white/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 backdrop-blur-sm">
                            Mumbai, India
                        </span>
                    </div>

                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-2xl font-black leading-tight tracking-tighter text-slate-900 sm:text-4xl">
                            {content.hero_headline || 'One engineer, start to finish.'}
                        </h1>
                        <p className="mt-4 text-base font-light leading-relaxed text-slate-700 sm:text-lg">
                            {content.hero_subtext || "Analytics Dev is me, Gulzar Ahmed. When you hire the studio, I am the one who writes the code, answers your messages and stays on the project after it goes live. Nothing gets passed to someone else."}
                        </p>
                    </div>
                </div>
            </MurmurationWordmark>

            {/* 2. THE NUMBERS, AS BENTO CARDS */}
            <section className="relative md:sticky md:top-0 z-10 md:-mt-20 flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] bg-white pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="blur" animationType="scrub" width="100%">
                        <AboutFacts />
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. HOW I GOT HERE */}
            <section className="relative md:sticky md:top-0 z-20 flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] bg-slate-50 pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <AboutPath />
                </div>
            </section>

            {/* 4. CORE BELIEFS */}
            <section className="relative md:sticky md:top-0 z-30 flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] bg-white pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="blur" animationType="scrub" width="100%">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                {content.dna_label || 'How I work'}
                            </p>
                            <ScrollRevealText
                                text={content.dna_headline || 'Three things I hold to.'}
                                className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                                variant="word"
                            />
                            <p className="mt-5 text-center text-base leading-relaxed text-slate-600 md:text-lg">
                                {content.dna_subtext || 'These are not slogans. They are the reasons projects here finish on the date I gave you.'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-3">
                        {[
                            {
                                step: '01',
                                title: content.belief_1_title || 'A price you can plan around',
                                text: content.belief_1_text || "You get one number in writing before any work starts, and it does not move unless you change what you asked for. Nobody should have to budget against an open-ended hourly bill, so I do not send them."
                            },
                            {
                                step: '02',
                                title: content.belief_2_title || 'Your data is messy. That is normal.',
                                text: content.belief_2_text || "Nobody hands me a clean spreadsheet. Dates in four formats, blank rows, two names for the same customer. I plan for that instead of asking you to fix it first, because that is what the real file always looks like."
                            },
                            {
                                step: '03',
                                title: content.belief_3_title || 'Built to be handed over',
                                text: content.belief_3_text || "The code, the domain and the hosting accounts are in your name from day one. If you hire someone else next year, they should be able to read what I wrote and carry on. That is the test I build to."
                            }
                        ].map((belief, i) => (
                            <ScrollReveal key={belief.step} delay={0.1 * (i + 1)} width="100%">
                                <div className="flex h-full flex-col bg-white p-8">
                                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                        <span className="font-semibold text-slate-900">{belief.step}</span>
                                        <span aria-hidden className="h-px w-4 bg-slate-300" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{belief.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{belief.text}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. WHERE I AM NOT THE RIGHT FIT */}
            <section className="relative md:sticky md:top-0 z-40 flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] bg-slate-50 pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="simple" width="100%">
                        <AboutFit />
                    </ScrollReveal>
                </div>
            </section>

            {/* 6. WHY I STARTED THIS */}
            <section className="relative md:sticky md:top-0 z-50 flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] bg-white pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="scale" width="100%">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                In my own words
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {content.founder_header || 'Why I started this'}
                            </h2>
                            <figure className="mt-10 border-l-4 border-slate-900 pl-8">
                                <blockquote className="text-lg font-medium leading-relaxed text-slate-900">
                                    <p>
                                        {renderText(content.founder_quote) || "“I kept meeting people who had been quoted a number they could not justify, for software they did not need. I wanted to be the person who tells them what they actually need, puts a number against it in writing, and then builds that.”"}
                                    </p>
                                </blockquote>
                                <figcaption className="mt-6 text-sm leading-6 text-slate-600">
                                    <strong className="font-semibold text-slate-900">{content.founder_name || 'Gulzar Ahmed'}</strong>, Owner
                                </figcaption>
                            </figure>
                            <div className="mt-10">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                                >
                                    {content.founder_cta || 'Tell me what you need'}
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 7. SHARE YOUR EXPERIENCE */}
            <section className="relative z-[60] flex md:min-h-[100dvh] flex-col justify-center rounded-t-[3.5rem] border-t border-slate-100 bg-slate-50 pt-12 pb-28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:pt-16 md:pb-32">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="simple" width="100%">
                        <ReviewForm />
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
