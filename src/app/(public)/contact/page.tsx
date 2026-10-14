import ContactForm from '@/components/public/ContactForm';
import { Mail, MessageSquare, Coffee } from 'lucide-react';
import ScrollReveal from '@/components/public/ScrollReveal';
import ScrollRevealText from '@/components/ui/ScrollRevealText'; // New
import * as pageRepo from '@/lib/repositories/page.repository';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Analytics Dev | Web & AI Development Studio Mumbai',
    description: 'Get in touch with founder Gulzar Ahmed for website development and production AI systems. Schedule a free 30-minute discovery call.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/contact',
    },
    openGraph: {
        title: 'Contact Analytics Dev | Mumbai & India',
        description: 'Schedule a free 30-minute discovery call. Fixed-scope proposals delivered in 24 hours.',
        url: 'https://analyticsdev.xyz/contact',
        type: 'website',
    },
};

const contactSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "ContactPage",
            "@id": "https://analyticsdev.xyz/contact#webpage",
            "url": "https://analyticsdev.xyz/contact",
            "name": "Contact Analytics Dev",
            "description": "Direct communication channel with founder and principal engineer Gulzar Ahmed.",
            "mainEntity": {
                "@type": "ContactPoint",
                "email": "hello@analyticsdev.xyz",
                "contactType": "customer service",
                "areaServed": ["IN", "OM", "AE"],
                "availableLanguage": ["English", "Hindi"]
            }
        }
    ]
};

async function getContactData() {
    const page = await pageRepo.findPageBySlug('contact').catch(() => null);
    return {
        content: page?.content || {}
    };
}

// Helper to render text with line breaks
const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
        </span>
    ));
};

export default async function ContactPage() {
    const { content } = await getContactData();

    return (
        <div className="bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />

            {/* 1. HERO: Human Tone - REDESIGNED (Professional Light) */}
            <div className="relative md:sticky md:top-0 z-0 isolate overflow-hidden bg-white md:min-h-[100dvh] flex flex-col items-center justify-center pt-36 sm:pt-32 pb-40">

                {/* Subtle Professional Background */}
                <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#0f172a_100%)] opacity-5" />
                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 sm:mr-28 lg:mr-0 lg:ml-10 lg:-skew-x-[18deg] xl:mr-36 xl:origin-center" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-7xl text-center">
                        <ScrollReveal variant="blur" animationType="scrub" width="100%">
                            <div className="mb-6 flex justify-center">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold leading-6 text-slate-900 ring-1 ring-inset ring-slate-900/10">
                                    {content.hero_tagline || 'Get in touch'}
                                </span>
                            </div>

                            {/* UPGRADED: Hero Text */}
                            <ScrollRevealText
                                text={content.hero_headline || "Tell me what you are stuck on."}
                                className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.15] py-4 text-center"
                                variant="char"
                                delay={0.2}
                            />

                            <ScrollRevealText
                                text={content.hero_subtext || "A few lines is enough. What the problem is, what you have already tried, and roughly when you need it done."}
                                className="mt-8 text-xl sm:text-2xl leading-relaxed text-slate-600 max-w-3xl mx-auto font-light text-center"
                                variant="word"
                                delay={0.4}
                            />
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* 2. CONTEXT & FORM */}
            <div className="relative z-10 bg-slate-50 rounded-t-[2.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] -mt-10 md:-mt-20 pt-6 pb-6 md:pt-24 md:pb-24 sm:pb-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                        {/* Left Column: Context / Transparency */}
                        <div className="flex flex-col gap-10">
                            <ScrollReveal width="100%" variant="simple">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                                        {content.context_title || 'What happens next'}
                                    </h2>
                                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                                        {content.context_subtext || 'No form that goes nowhere. Here is exactly what follows:'}
                                    </p>

                                    <dl className="mt-12 space-y-10 text-base leading-7 text-slate-600">
                                        <div className="flex gap-x-6">
                                            <div className="flex-none">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-900/10">
                                                    <MessageSquare className="h-6 w-6 text-slate-900" aria-hidden="true" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <dt className="inline font-bold text-slate-900">{content.response_time_title || 'A reply within 24 hours.'}</dt>
                                                <dd className="mt-1 text-slate-600">
                                                    {content.response_time_text || "From me, not an auto-responder. I will have read what you wrote before I answer."}
                                                </dd>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-6">
                                            <div className="flex-none">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-900/10">
                                                    <Coffee className="h-6 w-6 text-slate-900" aria-hidden="true" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <dt className="inline font-bold text-slate-900">{content.discovery_title || 'A 15-minute call, free.'}</dt>
                                                <dd className="mt-1 text-slate-600">
                                                    {content.discovery_text || "We work out whether I am the right person for this. If I am not, I will say so and point you somewhere better."}
                                                </dd>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-6">
                                            <div className="flex-none">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-900/10">
                                                    <Mail className="h-6 w-6 text-slate-900" aria-hidden="true" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <dt className="inline font-bold text-slate-900">{content.direct_access_title || 'You talk to me, every time.'}</dt>
                                                <dd className="mt-1">
                                                    <a href={`mailto:${content.email || 'hello@analyticsdev.xyz'}`} className="text-slate-900 font-bold hover:text-slate-700 hover:underline">
                                                        {content.email || 'hello@analyticsdev.xyz'}
                                                    </a>
                                                </dd>
                                            </div>
                                        </div>
                                    </dl>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right Column: Form */}
                        <ScrollReveal width="100%" variant="scale" delay={0.2}>
                            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                                <ContactForm />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>
    );
}
