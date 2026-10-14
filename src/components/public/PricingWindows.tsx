'use client';

import Link from 'next/link';
import AirplaneWindowGallery from '@/components/ui/AirplaneWindowGallery';
import type { WindowItem } from '@/components/ui/AirplaneWindowGallery';

type Detail = {
    price: string;
    basis: string;
    pickIf: string;
    buying: string;
    why: string;
    rows: { label: string; value: string }[];
    cta: string;
};

const OPTIONS: (WindowItem & { detail: Detail })[] = [
    {
        src: '/windows/website.svg',
        alt: 'A business website laid out as a browser window',
        title: 'Website',
        location: 'WordPress or fully coded',
        detail: {
            price: '₹35,000 to ₹45,000',
            basis: 'Fixed total',
            pickIf: 'People need to find you, read about you and get in touch.',
            buying: 'A finished job',
            why: 'The pages are known before we start, so the number can be known too.',
            rows: [
                { label: 'Typical build', value: '2 to 3 weeks' },
                { label: 'Support after handover', value: '1 month' },
                { label: 'Domain and hosting', value: 'Set up in your name' },
                { label: 'Maintenance', value: '₹5,000 per month, optional' },
                { label: 'Changes later', value: '₹500 per hour' }
            ],
            cta: 'Start a website'
        }
    },
    {
        src: '/windows/app.svg',
        alt: 'A web application dashboard with a sidebar, charts and a table',
        title: 'Web application',
        location: 'Logins, dashboards, payments',
        detail: {
            price: '₹700 to ₹800',
            basis: 'Per hour',
            pickIf: 'People need to log in and do something: orders, bookings, dashboards, payments.',
            buying: 'Engineering time',
            why: 'Hours follow the features. You approve an estimate first and see the hours as they are used.',
            rows: [
                { label: 'Typical build', value: '4 weeks onwards' },
                { label: 'Support after handover', value: '2 months' },
                { label: 'Domain and hosting', value: 'Free for the first year' },
                { label: 'Maintenance', value: 'Free 2 months, then ₹8,000 per month' },
                { label: 'Changes later', value: 'Same hourly rate' }
            ],
            cta: 'Get an hours estimate'
        }
    },
    {
        src: '/windows/ai.svg',
        alt: 'A data pipeline feeding a model and producing a checked output',
        title: 'AI and data work',
        location: 'Agents, automation, ML, analytics',
        detail: {
            price: '$10',
            basis: 'Per hour',
            pickIf: 'A repeated job should run on its own, or your data should answer questions.',
            buying: 'Engineering time',
            why: 'The work is research as much as building. You pay for what it takes, not a padded figure.',
            rows: [
                { label: 'Typical build', value: '3 weeks onwards' },
                { label: 'Support after handover', value: '1 month' },
                { label: 'Runs on', value: 'Your own cloud account' },
                { label: 'Maintenance', value: '₹6,000 per month, optional' },
                { label: 'Changes later', value: '$10 per hour' }
            ],
            cta: 'Talk it through'
        }
    }
];

function Details(item: WindowItem) {
    const d = item.detail as Detail | undefined;
    if (!d) return null;
    return (
        <div className="mx-auto w-full max-w-2xl">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{item.location}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold tabular-nums sm:text-2xl">{d.price}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{d.basis}</p>
                </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/90">
                <span className="text-white/60">Pick it if: </span>
                {d.pickIf}
            </p>

            <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="text-xs text-white/60">You are buying</dt>
                    <dd className="text-sm">{d.buying}</dd>
                </div>
                {d.rows.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
                        <dt className="text-xs text-white/60">{row.label}</dt>
                        <dd className="text-right text-sm tabular-nums">{row.value}</dd>
                    </div>
                ))}
            </dl>

            <p className="mt-3 text-xs leading-relaxed text-white/70">{d.why}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                    href="/contact"
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
                >
                    {d.cta}
                </Link>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                    Press Escape or click the view to go back
                </span>
            </div>
        </div>
    );
}

export default function PricingWindows({ className = '' }: { className?: string }) {
    return (
        <section id="which-one" className={`scroll-mt-28 ${className}`} aria-labelledby="which-one-heading">
            <div className="mb-8 max-w-2xl">
                <h2 id="which-one-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Which of the three is yours
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Not small, medium and large. Three different things to build, paid for in two
                    different ways. Pull a shade up or down, and click a window to read what that
                    one actually involves.
                </p>
            </div>

            <AirplaneWindowGallery
                items={OPTIONS}
                windows={3}
                autoplay={false}
                drift={24}
                shadeDuration={520}
                firstRow={1}
                renderDetails={Details}
            />
        </section>
    );
}
