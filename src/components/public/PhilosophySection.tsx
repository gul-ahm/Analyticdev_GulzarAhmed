'use client';

// Features with panel layout: the rules on the left, the detail for whichever
// one is selected on the right. The bento of value cards that was here before
// described a team, which this studio does not have.

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Rule = {
    title: string;
    heading: string;
    lines: string[];
    note?: string;
};

const RULES: Rule[] = [
    {
        title: 'Two projects at a time, never three',
        heading: 'Why the dates hold',
        lines: [
            'A second project starts only once the first has a delivery date I can keep',
            'If the slot you want is taken, I say so and give you the next real one',
            'A date from me is one I have the hours for, not the one you hoped to hear'
        ],
        note: 'One person cannot be in three places. Turning work down is how the other two finish on time.'
    },
    {
        title: 'Nothing is handed over, because there is nobody to hand it to',
        heading: 'The same person, start to finish',
        lines: [
            'Whoever scopes the work writes the code, and that is me',
            'Whoever writes the code answers your messages, and that is also me',
            'You explain your business once, not again to a junior or an account manager'
        ],
        note: 'Small is the point. Nothing gets lost between people when there are no people in between.'
    },
    {
        title: 'If the simpler thing works, I build the simpler thing',
        heading: 'Before reaching for anything clever',
        lines: [
            'A form and a spreadsheet beat a dashboard nobody opens',
            'WordPress when WordPress is enough, written code when it is not',
            'No extra service added that you would have to pay for and maintain alone'
        ],
        note: 'You are the one living with it after I am gone. That decides the choice, not what is interesting to build.'
    },
    {
        title: 'I will tell you when I think you are wrong',
        heading: 'Said during the project, not after',
        lines: [
            'If a feature will not earn back what it costs, you hear that before it is quoted',
            'If the deadline is not real, you hear that in the first call',
            'If the work is not something I am the right person for, I say so and point elsewhere'
        ],
        note: 'Agreeing with everything is easy and expensive. You are paying for judgement as much as hours.'
    },
    {
        title: 'Built so you can walk away from me',
        heading: 'The handover test',
        lines: [
            'Code in your GitHub account and the domain in your name, from day one',
            'Plain naming and ordinary patterns, so the next person is not decoding anything',
            'A short README saying how to run it and where everything lives'
        ],
        note: 'If you hire someone else next year, they should be able to pick it up without calling me.'
    }
];

function PanelBody({ rule }: { rule: Rule }) {
    return (
        <div className="flex h-full flex-col justify-center p-7 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                {rule.heading}
            </p>
            <ul className="mt-5 flex flex-col gap-3.5">
                {rule.lines.map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
                        <span>{line}</span>
                    </li>
                ))}
            </ul>
            {rule.note ? (
                <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
                    {rule.note}
                </p>
            ) : null}
        </div>
    );
}

export default function PhilosophySection() {
    const [active, setActive] = React.useState(0);

    return (
        <div className="relative z-20 flex min-h-screen flex-col justify-center overflow-hidden rounded-t-[2.5rem] bg-white pt-20 pb-16 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] sm:pb-20 md:-mt-24">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-14">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            How I work
                        </p>
                        <h2
                            id="philosophy-heading"
                            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                        >
                            Five rules I do not
                            <br className="hidden sm:block" /> bend
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
                            Not values on a wall. These are the decisions that actually change
                            what you get and when you get it. Pick one to read the detail.
                        </p>

                        <ul className="mt-8 flex flex-col gap-1">
                            {RULES.map((rule, index) => (
                                <motion.li
                                    key={rule.title}
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
                                    className={cn(
                                        'flex flex-col rounded-xl px-4 py-3.5 transition-colors duration-200 lg:flex-row lg:items-center lg:gap-4',
                                        active === index
                                            ? 'ring-1 ring-slate-900'
                                            : 'ring-1 ring-transparent hover:bg-slate-100/70'
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
                                                active === index
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-200 text-slate-600'
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
                                            {rule.title}
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
                                                    <PanelBody rule={rule} />
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
                                    <PanelBody rule={RULES[active]} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
