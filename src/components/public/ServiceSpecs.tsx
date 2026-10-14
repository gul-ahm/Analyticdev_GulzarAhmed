import * as React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Comparison table layout from 21st.dev. Rebuilt on a plain table with slate
// classes, since this project has no shadcn Table, Badge or Button.

type CellValue = boolean | string;
type Row = { label: string; values: [CellValue, CellValue, CellValue] };
type Group = { section: string; rows: Row[] };

const COLUMNS = [
    { name: 'Website', price: '₹35,000 to ₹45,000', cadence: 'Fixed total', cta: 'Start a website', href: '/contact', highlighted: true },
    { name: 'Web application', price: '₹700 to ₹800', cadence: 'Per hour', cta: 'Get an estimate', href: '/contact', highlighted: false },
    { name: 'AI and data work', price: '$10', cadence: 'Per hour', cta: 'Talk it through', href: '/contact', highlighted: false }
] as const;

const GROUPS: Group[] = [
    {
        section: 'What gets built',
        rows: [
            { label: 'Built on', values: ['WordPress or Next.js', 'Next.js and FastAPI', 'Python and LangChain'] },
            { label: 'Database', values: [false, 'Postgres', 'Postgres with vectors'] },
            { label: 'Logins and roles', values: [false, true, true] },
            { label: 'Payments', values: ['On request', true, false] },
            { label: 'Admin panel', values: ['CMS only', true, true] }
        ]
    },
    {
        section: 'Delivery',
        rows: [
            { label: 'Typical timeline', values: ['2 to 3 weeks', '4 weeks onwards', '3 weeks onwards'] },
            { label: 'Live staging link', values: [true, true, true] },
            { label: 'Lighthouse target', values: ['95+', '95+', false] },
            { label: 'SEO and schema markup', values: [true, 'Where it applies', false] },
            { label: 'Written scope before work starts', values: [true, true, true] }
        ]
    },
    {
        section: 'After handover',
        rows: [
            { label: 'Source code', values: ['Yours', 'Yours', 'Yours'] },
            { label: 'Domain and hosting', values: ['In your name', 'First year free', 'Your cloud account'] },
            { label: 'Support included', values: ['1 month', '2 months', '1 month'] },
            { label: 'Maintenance', values: ['₹5,000 / month', '₹8,000 / month', '₹6,000 / month'] },
            { label: 'Changes later', values: ['₹500 / hour', '₹700 to ₹800 / hour', '$10 / hour'] }
        ]
    }
];

function Cell({ value, highlighted }: { value: CellValue; highlighted: boolean }) {
    if (typeof value === 'boolean') {
        return value ? (
            <span className={cn('mx-auto flex size-5 items-center justify-center rounded-sm', highlighted ? 'bg-slate-900' : 'bg-slate-700')}>
                <Check className="size-3.5 text-white" aria-hidden />
                <span className="sr-only">Included</span>
            </span>
        ) : (
            <span className="mx-auto flex size-5 items-center justify-center rounded-sm bg-slate-100">
                <X className="size-3.5 text-slate-400" aria-hidden />
                <span className="sr-only">Not included</span>
            </span>
        );
    }
    return <span className={cn('text-sm', highlighted ? 'font-medium text-slate-900' : 'text-slate-600')}>{value}</span>;
}

export default function ServiceSpecs() {
    return (
        <section className="relative z-20 bg-slate-50 py-20 lg:py-28 border-t border-slate-200/60" id="specifications">
            <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
                <div className="mb-8 max-w-2xl">
                    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        <Sparkles className="size-3" aria-hidden />
                        Service specifications
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
                        What you get, line by line
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed sm:text-base">
                        The three ways of working here, side by side. A website is sold as a
                        finished job for a fixed number. The other two are billed by the hour
                        against an estimate you approve first.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full table-fixed text-sm">
                        <caption className="sr-only">Specifications for each kind of engagement</caption>
                        <thead>
                            <tr>
                                <th scope="col" className="w-[30%] min-w-[180px] border-b border-slate-200 px-5 align-bottom text-left">
                                    <span className="inline-block pb-3 pt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        Specification
                                    </span>
                                </th>
                                {COLUMNS.map((col) => (
                                    <th
                                        key={col.name}
                                        scope="col"
                                        className={cn(
                                            'min-w-[150px] border-b border-slate-200 px-4 text-center align-bottom',
                                            col.highlighted && 'bg-slate-100/70'
                                        )}
                                    >
                                        <div className="flex flex-col items-center gap-1 py-4">
                                            {col.highlighted ? (
                                                <span className="mb-1 rounded-full bg-slate-900 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
                                                    Most asked for
                                                </span>
                                            ) : null}
                                            <span className="text-sm font-semibold text-slate-900">{col.name}</span>
                                            <span className="text-base font-bold tabular-nums text-slate-900">{col.price}</span>
                                            <span className="text-xs font-normal text-slate-500">{col.cadence}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {GROUPS.map((group) => (
                                <React.Fragment key={group.section}>
                                    <tr className="bg-slate-50">
                                        <td colSpan={4} className="px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-900">
                                            {group.section}
                                        </td>
                                    </tr>
                                    {group.rows.map((row) => (
                                        <tr key={`${group.section}-${row.label}`} className="border-t border-slate-100">
                                            <th scope="row" className="px-5 py-3 text-left font-medium text-slate-900">
                                                {row.label}
                                            </th>
                                            {row.values.map((value, i) => (
                                                <td
                                                    key={`${row.label}-${COLUMNS[i].name}`}
                                                    className={cn('px-4 py-3 text-center', COLUMNS[i].highlighted && 'bg-slate-100/70')}
                                                >
                                                    <Cell value={value} highlighted={COLUMNS[i].highlighted} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}

                            <tr className="border-t border-slate-200">
                                <td className="py-4" />
                                {COLUMNS.map((col) => (
                                    <td key={`cta-${col.name}`} className={cn('px-4 py-4 text-center', col.highlighted && 'bg-slate-100/70')}>
                                        <Link
                                            href={col.href}
                                            className={cn(
                                                'inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                                                col.highlighted
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                    : 'border border-slate-300 text-slate-900 hover:bg-slate-100'
                                            )}
                                        >
                                            {col.cta}
                                            <ArrowRight className="size-3" aria-hidden />
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-slate-700" aria-hidden />
                        <span>Anything that was meant to work and does not is fixed free inside the support window.</span>
                    </div>
                    <Link href="/pricing" className="flex items-center gap-1 font-medium text-slate-900 hover:underline">
                        See the full pricing page <ExternalLink className="size-3" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
