import Link from 'next/link';
import * as careerRepo from '@/lib/repositories/career.repository';
import * as achievementRepo from '@/lib/repositories/achievement.repository';
import EmptyState from '@/components/shared/EmptyState';
import { Rocket, GraduationCap, Users, Trophy, ArrowRight, BrainCircuit, Code2, LineChart } from 'lucide-react';

async function getData() {
    // Fetch both datasets in parallel
    const [careers, achievements] = await Promise.all([
        careerRepo.findAllCareers().catch(() => []),
        achievementRepo.findAllAchievements().catch(() => [])
    ]);
    return { careers, achievements };
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers & Engineering Culture | Analytics Dev Mumbai',
    description: 'Explore engineering opportunities at Analytics Dev in Mumbai, India. Build deterministic AI workflows, Next.js web applications, and data systems.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/careers',
    },
    openGraph: {
        title: 'Careers & Engineering Culture | Analytics Dev',
        description: 'Build real systems with a small, focused engineering team in Mumbai, India.',
        url: 'https://analyticsdev.xyz/careers',
        type: 'website',
    },
};

const careersSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": "https://analyticsdev.xyz/careers#webpage",
            "url": "https://analyticsdev.xyz/careers",
            "name": "Careers at Analytics Dev",
            "description": "Engineering roles and culture at Analytics Dev.",
            "isPartOf": {
                "@id": "https://analyticsdev.xyz/#website"
            }
        }
    ]
};

export default async function CareersPage() {
    const { careers, achievements } = await getData();

    return (
        <div className="bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(careersSchema) }}
            />

            {/* 1. HERO: Motivational Tone */}
            <div className="relative isolate overflow-hidden bg-white/40 backdrop-blur-sm pt-32 pb-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="flex justify-center mb-6">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-900/10">
                                Hiring
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            I hire on what you can build.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Show me something you made and talk me through why you made it that way.
                            That tells me more than a degree does. If there is no role open below, write anyway.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a href="#open-roles" className="rounded-md bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                                See open roles
                            </a>
                            <a href="#impact" className="text-sm font-semibold leading-6 text-gray-900">
                                See the work
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACHIEVEMENTS SECTION (only when there is something real to show) */}
            {achievements.length > 0 && (
                <div id="impact" className="bg-transparent py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-slate-900">Track record</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                What the work has added up to
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {achievements.map((item) => (
                                <div key={item.id} className="flex flex-col bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200">
                                    <dt className="text-sm font-semibold leading-6 text-gray-600">
                                        {item.title}
                                    </dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 mb-2">
                                        {item.value}
                                    </dd>
                                    <dd className="text-sm text-gray-500 mt-2">
                                        {item.description}
                                    </dd>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. CULTURE / VALUES */}
            <div className="bg-slate-50 py-24 sm:py-32 border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What working here is like</h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Small studio, real projects, and your work goes live in front of actual users.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-3">
                                    <BrainCircuit className="h-7 w-7 text-slate-900" />
                                    Understand it before you build it
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">Copying a solution you do not understand is how projects break six months later. Take the problem apart first.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-3">
                                    <Code2 className="h-7 w-7 text-slate-900" />
                                    Ownership
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">You design it, build it and ship it. Nothing gets thrown over a wall for someone else to deal with.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-3">
                                    <LineChart className="h-7 w-7 text-slate-900" />
                                    Does it work for the client
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">The test is whether the client is better off, not how many hours went in or how clever the code was.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* 4. OPEN ROLES (Dynamic) */}
            <div id="open-roles" className="bg-transparent py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Open Positions</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Ready to join the builders?
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        {careers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-8">
                                {careers.map((role) => (
                                    <div key={role.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-slate-200 transition-colors">
                                        <div className="mb-4 sm:mb-0">
                                            <h3 className="text-lg font-semibold leading-6 text-gray-900">{role.title}</h3>
                                            <div className="mt-2 flex items-center gap-x-3 text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-md bg-white px-2 py-1 font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    Full-time
                                                </span>
                                                <span className="inline-flex items-center rounded-md bg-white px-2 py-1 font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    Remote
                                                </span>
                                            </div>
                                            <p className="mt-4 text-sm text-gray-600 max-w-xl">{role.description}</p>
                                        </div>
                                        <Link
                                            href={`/contact?subject=Application for ${role.title}`}
                                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-gray-50"
                                        >
                                            Apply Now <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No Open Roles Currently"
                                description="We don't have specific openings right now, but we are always looking for exceptional talent. If you think you can add value, pitch us."
                                icon="Briefcase"
                                action={{ label: 'Pitch Yourself', href: '/contact' }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
