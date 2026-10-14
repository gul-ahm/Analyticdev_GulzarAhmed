'use client';

// The about page rebuilt from blocks already used elsewhere on the site: the
// plus-marked bento cards from the pricing page, the orb row from the services
// methodology, and the before/after split from the pricing comparison.

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    Check,
    CircleAlert,
    CircleCheck,
    Minus,
    GraduationCap,
    Briefcase,
    Building2,
    Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PlusCard from '@/components/ui/PlusCard';

/* ── the numbers, as bento cards ─────────────────────────────── */

export function AboutFacts({ className = '' }: { className?: string }) {
    return (
        <section className={className} aria-labelledby="about-facts-heading">
            <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <PlusCard
                    className="lg:col-span-3 lg:row-span-2"
                    title="One engineer, end to end"
                    description="I am Gulzar Ahmed. When you hire the studio, I am the person who writes the code, answers your messages and stays on the project after it goes live. There is no account manager in between and nothing gets passed to a junior."
                    footnote="I take on a small number of projects at a time. That is a limit, not a sales line. It is why timelines hold."
                />
                <PlusCard
                    className="lg:col-span-3 lg:row-span-2"
                    title="What I can point at"
                    description="Every number here is something I can name, open or walk you through."
                    rows={[
                        { label: 'Systems built and shipped', value: '13', strong: true },
                        { label: 'Sectors worked in', value: '5', strong: true },
                        { label: 'Shipping production code since', value: '2024', strong: true }
                    ]}
                    footnote="Construction, healthcare and medical supply, retail and ecommerce, real estate, education."
                />
                <PlusCard
                    className="lg:col-span-2"
                    title="Where I am"
                    description="Mumbai, India. Work delivered for clients here and in Oman, remotely, on their hours where it matters."
                />
                <PlusCard
                    className="lg:col-span-2"
                    title="How I learned it"
                    description="A diploma in computer engineering, then a BTech in computer science with an AI specialisation. The rest came from shipping."
                />
                <PlusCard
                    className="lg:col-span-2"
                    title="What you own"
                    description="The code, the domain and every account, in your name from day one. Nothing to buy back if you leave."
                />
            </div>

            <div className="ml-auto mt-6 max-w-2xl px-4 text-right lg:-mt-20">
                <h2
                    id="about-facts-heading"
                    className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl"
                >
                    A studio you can
                    <br /> fit in one head
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                    Small enough that nothing gets lost in a handover, because there is no
                    handover. You talk to the person building it.
                </p>
            </div>
        </section>
    );
}

/* ── the route here, as the methodology orbs ─────────────────── */

const STEPS = [
    {
        step: '01',
        icon: GraduationCap,
        title: 'Diploma, then a BTech',
        timeframe: '2018 to 2025',
        description:
            'A diploma in computer engineering first, then a BTech in computer science with an AI specialisation. Two routes into the same thing, five years apart.',
        orbClassName: 'border-4 border-dashed'
    },
    {
        step: '02',
        icon: Briefcase,
        title: 'First production work',
        timeframe: '2024',
        description:
            'Inventory and sales data on a retail platform. The first year of writing things other people depended on, which is a different job from writing things that work.'
    },
    {
        step: '03',
        icon: Building2,
        title: 'Owning the AI side of a product',
        timeframe: '2025 to 2026',
        description:
            'An agentic quantity surveying system for a construction tech firm, owned from first design through to production, alongside their React marketing site.'
    },
    {
        step: '04',
        icon: Rocket,
        title: 'AnalyticsDev',
        timeframe: '2026 onwards',
        description:
            'My own studio, and where the client work runs now. Websites, applications, AI and data work, with the scope and the number agreed before anything starts.'
    }
];

export function AboutPath({ className = '' }: { className?: string }) {
    const reduce = useReducedMotion();
    return (
        <section className={className} aria-labelledby="about-path-heading">
            <div className="mx-auto flex w-full flex-col gap-14">
                <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
                    <span className="mx-auto rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        How I got here
                    </span>
                    <h2
                        id="about-path-heading"
                        className="text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl"
                    >
                        Eight years of this{' '}
                        <span className="text-slate-400">before the studio had a name</span>
                    </h2>
                    <p className="mx-auto text-sm leading-relaxed text-slate-600 md:text-base">
                        Not a career arc, just the order things happened in. Each one taught me
                        something the next one needed.
                    </p>
                </div>

                <div className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((phase, i) => (
                        <motion.div
                            key={phase.step}
                            className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-sm border border-slate-200 bg-white px-7 pb-8 pt-10 text-center"
                            initial={reduce ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                        >
                            <div
                                className={cn(
                                    'relative mx-auto flex size-28 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xs outline outline-slate-200 outline-offset-4',
                                    phase.orbClassName
                                )}
                            >
                                <div
                                    aria-hidden
                                    className="absolute inset-0 z-10 scale-125 rounded-full blur-xl"
                                    style={{
                                        background:
                                            'radial-gradient(circle, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.05) 45%, transparent 70%)'
                                    }}
                                />
                                <phase.icon aria-hidden className="relative z-20 size-11 text-slate-700" strokeWidth={1.4} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                    <span className="font-semibold text-slate-900">{phase.step}</span>
                                    <span aria-hidden className="h-px w-4 bg-slate-300" />
                                    <span>{phase.timeframe}</span>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">{phase.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-600">{phase.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── where I am not the right fit, as the before/after split ─── */

const NOT_ME = [
    'Requirements still undecided, and a brief that moves while it is being built',
    'Design with no build attached',
    'A third project at the same time, when two are already running',
    'Anything I cannot test before handing it over'
] as const;

const ME = [
    'A rough idea we shape together, then a scope written down before any code',
    'Design and build as one job, by the same person',
    'Two projects at a time, which is why the dates hold',
    'Work I can prove runs, on your machine, before you pay the last invoice'
] as const;

export function AboutFit({ className = '' }: { className?: string }) {
    return (
        <section className={className} aria-labelledby="about-fit-heading">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                Where I am not the right fit
            </p>
            <h2
                id="about-fit-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
                Every studio says it can do everything
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                That is never true, and you find out which parts were not true somewhere
                around week three. So here is the line, before you spend anything.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">
                <div className="bg-white p-7 sm:p-8">
                    <div className="flex items-center gap-2">
                        <CircleAlert aria-hidden className="h-4 w-4 text-slate-400" />
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                            I will turn this down
                        </h3>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
                        {NOT_ME.map((item) => (
                            <li key={item} className="flex gap-3 text-sm text-slate-500">
                                <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                                <span className="line-through decoration-slate-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-50 p-7 sm:p-8">
                    <div className="flex items-center gap-2">
                        <CircleCheck aria-hidden className="h-4 w-4 text-slate-900" />
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-900">
                            This is the work I want
                        </h3>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
                        {ME.map((item) => (
                            <li key={item} className="flex gap-3 text-sm text-slate-800">
                                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                    Tell me what you are stuck on
                    <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
                <Link
                    href="/projects"
                    className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                >
                    Or read the work first
                </Link>
            </div>
        </section>
    );
}
