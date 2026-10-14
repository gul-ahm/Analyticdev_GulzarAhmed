'use client';

// Layout from Hirael Feature 07
// MIT, Mohammad Shehadeh, https://github.com/MohammadShehadeh/hirael

import { ClipboardList, PenTool, MonitorPlay, KeyRound } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PHASES = [
    {
        step: '01',
        icon: ClipboardList,
        title: 'We work out what you need',
        timeframe: 'Days 1 to 3',
        description:
            'I ask what is actually slowing you down, then write the scope and the number. A website gets its fixed number. A web application or an AI build gets an estimate of hours at the published rate. You read either one before paying anything.',
        orbClassName: 'border-4 border-dashed'
    },
    {
        step: '02',
        icon: PenTool,
        title: 'I plan it before I build it',
        timeframe: 'Days 4 to 7',
        description:
            'The database, the screens and how the pieces talk to each other get designed first. Changing a plan costs an afternoon. Changing finished code costs a week.'
    },
    {
        step: '03',
        icon: MonitorPlay,
        title: 'You watch it come together',
        timeframe: 'Weeks 2 to 4',
        description:
            'A live link you can open any time, updated every week. You see the real thing as it is built instead of waiting for a demo at the end.'
    },
    {
        step: '04',
        icon: KeyRound,
        title: 'Testing, then it is yours',
        timeframe: 'Final week',
        description:
            'Speed, security and search checks all run before launch. Then the code, the domain and every login go across to you, and 30 days of free bug fixing starts.'
    }
];

export default function ServiceMethodology() {
    const reduce = useReducedMotion();

    return (
        <section className="relative md:sticky md:top-0 z-30 md:min-h-[100dvh] flex flex-col justify-center bg-white py-20 lg:py-28" id="methodology">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 lg:px-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
                    <span className="mx-auto rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        Delivery methodology
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
                        How a project actually runs{' '}
                        <span className="text-slate-400">from the first call to the handover</span>
                    </h2>
                    <p className="mx-auto text-sm leading-relaxed text-slate-600 md:text-base">
                        Four stages, in order. You see real progress at each one, and the scope
                        cannot quietly grow along the way.
                    </p>
                </div>

                <div className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {PHASES.map((phase, i) => (
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
