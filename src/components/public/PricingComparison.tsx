// Layout adapted from Hirael Comparison 03
// MIT, Mohammad Shehadeh, https://github.com/MohammadShehadeh/hirael

import Link from 'next/link';
import { ArrowRight, Check, CircleAlert, CircleCheck, Minus } from 'lucide-react';

const USUAL = [
    'One number covers a brochure site and a system with logins, so one of the two is wrong',
    'Hourly work with no published rate, so the first invoice is a surprise',
    'The fixed price moves the moment the scope moves, and the argument starts there',
    'Support ends the day the invoice clears'
] as const;

const HERE = [
    'A website is one fixed number, because its pages are known before the work starts',
    'An application and AI work are hourly at a rate published on this page',
    'The estimate changes only after you approve the change, in writing',
    'Support runs 1 to 2 months past handover, and fixing what should have worked costs nothing'
] as const;

const RATES = [
    { value: '₹35,000 to ₹45,000', label: 'fixed, website on WordPress or code' },
    { value: '₹700 to ₹800 / hr', label: 'web application, estimated first' },
    { value: '$10 / hr', label: 'AI, machine learning and data work' }
] as const;

export default function PricingComparison({ className = '' }: { className?: string }) {
    return (
        <section className={className} aria-labelledby="pricing-comparison-heading">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                How the number is set
            </p>
            <h2
                id="pricing-comparison-heading"
                className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            >
                Two ways a quote can go
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 leading-relaxed">
                The same project, priced two ways. The column on the right is how this
                studio works, and the rest of the page is just the detail behind it.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">
                <div className="bg-white p-7 sm:p-8">
                    <div className="flex items-center gap-2">
                        <CircleAlert aria-hidden className="h-4 w-4 text-slate-400" />
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                            The quote you usually get
                        </h3>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
                        {USUAL.map((item) => (
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
                            The quote you get here
                        </h3>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
                        {HERE.map((item) => (
                            <li key={item} className="flex gap-3 text-sm text-slate-800">
                                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                    {RATES.map((rate) => (
                        <div key={rate.value} className="flex items-baseline gap-2">
                            <dt className="text-xs text-slate-500">{rate.label}</dt>
                            <dd className="order-first font-mono text-sm font-semibold tracking-tight text-slate-900 tabular-nums">
                                {rate.value}
                            </dd>
                        </div>
                    ))}
                </dl>
                <Link
                    href="#which-one"
                    className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
                >
                    See what each one includes
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </Link>
            </div>
        </section>
    );
}
