'use client';

// Layout from the Features with panel block on 21st.dev. The panel holds
// written detail rather than screenshots, because every claim on this page has
// to be checkable and a stock photograph is not.

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Panel = { heading: string; lines: string[]; excluded?: boolean; note?: string };
type Item = { title: string; panel: Panel };

const ITEMS: Item[] = [
    {
        title: 'The scope and the number, in writing',
        panel: {
            heading: 'Before you pay anything',
            lines: [
                'A one page scope of work listing every page, feature and deliverable',
                'The agreed number on that same page, with milestones',
                'Anything outside it is quoted separately and needs your written approval',
                'No hourly billing on a website, and no overage on an approved estimate'
            ],
            note: 'You read this document before the first payment, not after.'
        }
    },
    {
        title: 'The code, the domain and the accounts',
        panel: {
            heading: 'Yours from day one',
            lines: [
                'Full source code on GitHub, in your account',
                'Domain registered in your name, not mine',
                'Hosting, analytics and email accounts handed over with the keys',
                'No licence, no retainer and nothing to buy back if you leave'
            ],
            note: 'If you hire someone else next year, they can pick it up without me.'
        }
    },
    {
        title: 'Speed, search and the basics',
        panel: {
            heading: 'Checked before handover, not promised',
            lines: [
                'Lighthouse 95 or better, written into the scope',
                'Meta tags, sitemap.xml, robots.txt and schema markup',
                'Registered in Google Search Console with indexing confirmed',
                'Tested on phone, tablet and desktop',
                'SSL through Cloudflare or Let us Encrypt, at no cost'
            ]
        }
    },
    {
        title: 'Support after it goes live',
        panel: {
            heading: 'One month on a website, two on an application',
            lines: [
                'Anything that was meant to work and does not is fixed free in that window',
                'After it closes, changes are billed at the hourly rate on this page',
                'Monthly maintenance is optional and covers updates, backups and uptime',
                'Nothing renews on its own'
            ]
        }
    },
    {
        title: 'What is not included',
        panel: {
            heading: 'Quoted separately, or not my work at all',
            excluded: true,
            lines: [
                'Domain registration fees, paid straight to the registrar',
                'Copywriting from scratch, though I give you the structure',
                'Photography and video production',
                'Ongoing marketing or ad campaigns after handover',
                'Third party licences such as paid SaaS or SMS credits'
            ],
            note: 'I charge no markup on any third party service.'
        }
    }
];

function PanelBody({ panel }: { panel: Panel }) {
    const Icon = panel.excluded ? X : Check;
    return (
        <div className="flex h-full flex-col justify-center p-7 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                {panel.heading}
            </p>
            <ul className="mt-5 flex flex-col gap-3.5">
                {panel.lines.map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                        <Icon
                            aria-hidden
                            className={cn('mt-0.5 h-4 w-4 shrink-0', panel.excluded ? 'text-slate-400' : 'text-slate-900')}
                        />
                        <span>{line}</span>
                    </li>
                ))}
            </ul>
            {panel.note ? (
                <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
                    {panel.note}
                </p>
            ) : null}
        </div>
    );
}

export default function PricingIncluded({ className = '' }: { className?: string }) {
    const [active, setActive] = React.useState(0);

    return (
        <section className={className} aria-labelledby="pricing-included-heading">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-14">
                <div>
                    <h2
                        id="pricing-included-heading"
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                    >
                        What you get, and what you do not
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        Written down so there is nothing to argue about later. Pick a row to
                        read the detail.
                    </p>

                    <ul className="mt-8 flex flex-col gap-1">
                        {ITEMS.map((item, index) => (
                            <motion.li
                                key={item.title}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
                                className={cn(
                                    'flex flex-col rounded-xl px-4 py-3.5 transition-colors duration-200 lg:flex-row lg:items-center lg:gap-4',
                                    active === index ? 'ring-1 ring-slate-900' : 'ring-1 ring-transparent hover:bg-slate-100/70'
                                )}
                            >
                                <button
                                    type="button"
                                    aria-expanded={active === index}
                                    onClick={() => setActive(index)}
                                    className="flex w-full cursor-pointer flex-row items-center gap-4 text-left lg:contents"
                                >
                                    <span
                                        className={cn(
                                            'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200',
                                            active === index ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    <span
                                        className={cn(
                                            'text-sm font-medium transition-colors duration-200',
                                            active === index ? 'text-slate-900' : 'text-slate-600'
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {active === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                            className="w-full overflow-hidden lg:hidden"
                                        >
                                            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                                <PanelBody panel={item.panel} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div className="sticky top-28 hidden lg:block">
                    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <PanelBody panel={ITEMS[active].panel} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
