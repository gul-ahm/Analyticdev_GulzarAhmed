import Link from 'next/link';
import ScrollReveal from '@/components/public/ScrollReveal';
import HorizontalServices from '@/components/public/HorizontalServices';
import RobotHero from '@/components/ui/RobotHero';
import ServiceMethodology from '@/components/public/ServiceMethodology';
import ServiceSpecs from '@/components/public/ServiceSpecs';
import FaqAccordion from '@/components/ui/FaqChatAccordion';
import { findAllServices } from '@/lib/repositories/service.repository';
import { ArrowRight } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Engineering Services | Web Development, AI Systems & Data Infrastructure Mumbai',
    description: 'Websites at a fixed ₹35,000 to ₹45,000, web applications at ₹700 to ₹800 an hour, AI and data work at $10 an hour. One engineer in Mumbai. The code is yours from day one.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/services',
    },
    openGraph: {
        title: 'Engineering Services | Web Development & AI Systems Mumbai',
        description: 'Websites, AI automation and data work, built by one engineer in Mumbai.',
        url: 'https://analyticsdev.xyz/services',
        type: 'website',
    },
};

const serviceFaqs = [
    {
        question: "How does Analytics Dev price its web development and AI engineering services?",
        answer: "One thing here has a fixed price: a website, on WordPress or fully coded, at ₹35,000 to ₹45,000 with one month of support. The pages are known before we start, so the number can be known too. A web application is ₹700 to ₹800 an hour with two months of support and a free first year of domain and hosting. AI, machine learning and data work is $10 an hour. Those two are hourly because the hours follow what the system has to do, and a fixed number there would only be a padded guess. You approve an estimate in writing before any hour is billed."
    },
    {
        question: "Do clients retain 100% ownership of the source code and infrastructure?",
        answer: "Yes, all of it. The repository is transferred to you at handover and the hosting runs in your own accounts, not mine. If you want to hire someone else next year, nothing here stops you."
    },
    {
        question: "How does Analytics Dev prevent hallucinations and errors in AI systems?",
        answer: "A model that is free to answer anything will eventually answer wrongly, so I do not build them that way. Output has to match a fixed shape before it is accepted, answers come from your own documents with the source attached, a person signs off at the points that matter, and a test suite checks the output before anything is written to your database."
    },
    {
        question: "What is the typical delivery timeline for a custom web application or website?",
        answer: "A website is 14 to 21 working days. A full web application or an AI integration is 21 to 35, depending on how complex the data is and how many other systems it has to talk to. The date goes in the contract."
    },
    {
        question: "What performance guarantees and post-launch support are included?",
        answer: "Every site is contractually held to a 95+ Lighthouse score on desktop and mobile. After launch you get 30 days of bug fixes and security patching at no cost. A monthly maintenance plan after that is optional, and you can cancel it whenever you like."
    }
];

const servicesSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": "https://analyticsdev.xyz/services",
            "url": "https://analyticsdev.xyz/services",
            "name": "Engineering Services | Web Development, AI Systems & Data Infrastructure Mumbai",
            "description": "Websites, AI automation and data systems, built by one engineer in Mumbai.",
            "breadcrumb": { "@id": "https://analyticsdev.xyz/services#breadcrumb" },
            "isPartOf": { "@id": "https://analyticsdev.xyz/#website" }
        },
        {
            "@type": "BreadcrumbList",
            "@id": "https://analyticsdev.xyz/services#breadcrumb",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://analyticsdev.xyz"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Services",
                    "item": "https://analyticsdev.xyz/services"
                }
            ]
        },
        {
            "@type": "Service",
            "@id": "https://analyticsdev.xyz/services#web",
            "name": "Modern Web Engineering",
            "serviceType": "Web Development",
            "provider": { "@id": "https://analyticsdev.xyz/#organization" },
            "areaServed": [
                { "@type": "City", "name": "Mumbai" },
                { "@type": "State", "name": "Maharashtra" },
                { "@type": "Country", "name": "India" },
                { "@type": "AdministrativeArea", "name": "Global" }
            ],
            "description": "Websites and web applications on Next.js, React and TypeScript, held to a 95+ Core Web Vitals score, with the code handed over to the client.",
            "serviceOutput": "A Next.js website that loads in under a second, with the code in the client's name",
            "offers": {
                "@type": "Offer",
                "price": "35000",
                "priceCurrency": "INR",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": "35000",
                    "priceCurrency": "INR",
                    "valueAddedTaxIncluded": true
                }
            }
        },
        {
            "@type": "Service",
            "@id": "https://analyticsdev.xyz/services#ai",
            "name": "AI Systems & Autonomous Workflow Agents",
            "serviceType": "Artificial Intelligence Development",
            "provider": { "@id": "https://analyticsdev.xyz/#organization" },
            "areaServed": [
                { "@type": "City", "name": "Mumbai" },
                { "@type": "Country", "name": "India" },
                { "@type": "AdministrativeArea", "name": "Global" }
            ],
            "description": "Software that does a repeated job on its own, working from the client's own data, with checks on what it produces.",
            "serviceOutput": "Automation that answers from the client's own documents, with the source attached",
            "offers": {
                "@type": "Offer",
                "price": "10",
                "priceCurrency": "USD",
                "unitCode": "HUR"
            }
        },
        {
            "@type": "Service",
            "@id": "https://analyticsdev.xyz/services#data",
            "name": "Data Infrastructure & Analytics Pipelines",
            "serviceType": "Data Engineering",
            "provider": { "@id": "https://analyticsdev.xyz/#organization" },
            "areaServed": [
                { "@type": "City", "name": "Mumbai" },
                { "@type": "Country", "name": "India" },
                { "@type": "AdministrativeArea", "name": "Global" }
            ],
            "description": "Scattered business data pulled into one database, with dashboards on top and checks that catch bad numbers.",
            "serviceOutput": "One database the business can trust, with dashboards on top",
            "offers": {
                "@type": "Offer",
                "price": "10",
                "priceCurrency": "USD",
                "unitCode": "HUR"
            }
        },
        {
            "@type": "Service",
            "@id": "https://analyticsdev.xyz/services#cloud",
            "name": "Cloud DevOps & Edge Performance",
            "serviceType": "DevOps & Cloud Engineering",
            "provider": { "@id": "https://analyticsdev.xyz/#organization" },
            "areaServed": [
                { "@type": "City", "name": "Mumbai" },
                { "@type": "Country", "name": "India" },
                { "@type": "AdministrativeArea", "name": "Global" }
            ],
            "description": "Deployments that do not take a site offline, fast loading worldwide, and monitoring, on Vercel, Cloudflare and AWS.",
            "serviceOutput": "Automated deployment, with protection against attacks and traffic floods",
            "offers": {
                "@type": "Offer",
                "price": "25000",
                "priceCurrency": "INR"
            }
        },
        {
            "@type": "FAQPage",
            "@id": "https://analyticsdev.xyz/services#faq",
            "mainEntity": serviceFaqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        }
    ]
};

export const dynamic = 'force-dynamic';

import { IService } from '@/models/Service';

const DEFAULT_SERVICES: IService[] = [
    {
        id: 1,
        title: 'Websites and web applications',
        slug: 'web-engineering',
        description: 'Websites and web applications on Next.js, React and TypeScript. Fast on a phone, easy to find on Google, and the only service here sold as a finished job rather than by the hour.',
        icon: 'Code2',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: [
            'Fast on a phone, with a 95+ Lighthouse score in the contract',
            'The code, domain and hosting accounts are in your name',
            'Built so Google and AI search engines can read it properly',
            'Live in 14 to 21 working days'
        ]
    },
    {
        id: 2,
        title: 'AI agents and automation',
        slug: 'ai-decision-systems',
        description: 'Software that does a repeated job on its own, working from your own data, with checks in place so you can trust what comes out of it.',
        icon: 'BrainCircuit',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: [
            'Answers come from your own documents, with the source attached',
            'Output has to match a fixed shape before it is accepted',
            'A person signs off at the points that matter',
            'Connects to the tools you already use: CRM, email, webhooks'
        ]
    },
    {
        id: 3,
        title: 'Data work and dashboards',
        slug: 'data-infrastructure',
        description: 'Your numbers pulled into one place you can trust, with dashboards on top, so nobody has to ask which spreadsheet is the right one.',
        icon: 'Database',
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: [
            'Your scattered data pulled into one clean database',
            'Dashboards where every figure traces back to its source',
            'Checks that tell you when a number stops making sense',
            'Handles the messy real file, not an idealised one'
        ]
    },
    {
        id: 4,
        title: 'Hosting and deployment',
        slug: 'cloud-devops',
        description: 'Deployments that go out without taking the site down, fast loading worldwide, and monitoring that tells me something is wrong before you notice.',
        icon: 'Server',
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: [
            'Deploys that do not take the site offline',
            'Fast loading worldwide through a CDN',
            'Protection against attacks and traffic floods',
            'Running on your own accounts, not mine'
        ]
    }
];



export default async function ServicesPage() {
    let servicesData: IService[] = await findAllServices().catch(() => [] as IService[]);
    if (!servicesData || servicesData.length === 0) {
        servicesData = DEFAULT_SERVICES;
    }

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
            />

            {/* 1. HERO */}
            <RobotHero backgroundText="ANALYTICSDEV">
                <h1 className="max-w-2xl text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                    Websites, AI automation and data work
                </h1>
                <p className="mt-5 max-w-xl text-base text-slate-700 leading-relaxed">
                    One engineer in Mumbai. A website is a fixed ₹35,000 to ₹45,000. A web
                    application is ₹700 to ₹800 an hour, and AI, automation and data work is
                    $10 an hour, both against an estimate you approve first. Either way, the
                    code, domain and hosting accounts are in your name from day one.
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-5 text-sm font-medium">
                    <Link
                        href="/pricing"
                        className="rounded-full bg-slate-900 px-7 py-3 text-white transition-colors hover:bg-slate-700"
                    >
                        Website pricing
                    </Link>
                    <Link
                        href="/contact"
                        className="text-slate-800 underline decoration-slate-400 underline-offset-4 transition-colors hover:decoration-slate-900"
                    >
                        Book a call
                    </Link>
                </div>
            </RobotHero>

            {/* 2. INTERACTIVE 3D CAROUSEL (Interactive Showcase) */}
            <HorizontalServices services={servicesData} />

            <ServiceSpecs />

            <ServiceMethodology />

            {/* 5. AEO FREQUENTLY ASKED QUESTIONS (FAQPage Schema Supported) */}
            <section className="relative z-40 bg-slate-50 py-20 lg:py-28 border-t border-slate-200/60" id="faqs">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-slate-900 uppercase">
                            DIRECT ANSWERS
                        </span>
                        <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
Questions I get asked before we start
                        </h2>
                        <p className="mt-4 text-base text-slate-600">
                            The questions people actually ask before hiring me, answered the way I would answer them on a call.
                        </p>
                    </div>

                    <FaqAccordion
                        data={serviceFaqs}
                        timestamp="Answered by Gulzar Ahmed, the person who does the work"
                    />
                </div>
            </section>

            {/* 6. CALL TO ACTION SECTION */}
            <section className="relative md:sticky md:top-0 z-50 md:min-h-[100dvh] flex flex-col justify-center bg-white py-20 md:py-28 border-t border-slate-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <ScrollReveal variant="scale" width="100%">
                        <div className="mx-auto max-w-3xl text-center bg-slate-900 rounded-3xl py-16 px-6 sm:px-16 shadow-2xl relative isolate overflow-hidden text-white">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-slate-500/20 rounded-full blur-3xl pointer-events-none" />

                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-950/80 border border-slate-800/60 px-3.5 py-1 rounded-full">
Free, no obligation
                            </span>

                            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
Want to talk it through?
                            </h2>
                            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
A 20-minute call with me, not a sales person. We work out whether the thing you want is worth building, and if it is, you leave with a written scope and a number.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                                >
                                    Book a call
                                </Link>
                                <Link 
                                    href="/projects" 
                                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-4 py-3"
                                >
                                    See what I have built <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
