'use client';

// FAQ chat accordion, after the 21st.dev component of that name by Anshuman
// (MIT). Rebuilt on framer-motion and local state rather than ported, because
// the source is not served to fetchers and the original needs
// @radix-ui/react-accordion, which this project does not carry.
// The prop shape matches the original, so the real file can drop straight in.

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FaqItem = {
    id?: number | string;
    question: string;
    answer: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
};

interface FaqAccordionProps {
    data: FaqItem[];
    className?: string;
    questionClassName?: string;
    answerClassName?: string;
    /** Small muted line under the thread. */
    timestamp?: string;
    /** Index open on first render. Pass -1 for all closed. */
    defaultOpen?: number;
}

export default function FaqAccordion({
    data,
    className,
    questionClassName,
    answerClassName,
    timestamp,
    defaultOpen = 0
}: FaqAccordionProps) {
    const [open, setOpen] = React.useState<number>(defaultOpen);

    return (
        <div className={cn('flex w-full flex-col gap-3', className)}>
            {data.map((item, i) => {
                const isOpen = open === i;
                const key = item.id ?? i;
                return (
                    <div key={key} className="flex flex-col gap-3">
                        <h3 className="flex">
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? -1 : i)}
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${key}`}
                                className={cn(
                                    'group flex w-full items-start gap-3 rounded-2xl rounded-tl-sm border px-5 py-4 text-left transition-colors',
                                    isOpen
                                        ? 'border-slate-300 bg-slate-100'
                                        : 'border-slate-200 bg-white hover:bg-slate-50',
                                    questionClassName
                                )}
                            >
                                {item.icon && item.iconPosition === 'left' ? (
                                    <span aria-hidden className="shrink-0 leading-6">
                                        {item.icon}
                                    </span>
                                ) : null}

                                <span className="flex-1 text-base font-medium text-slate-900 sm:text-lg">
                                    {item.question}
                                </span>

                                {item.icon && item.iconPosition === 'right' ? (
                                    <span aria-hidden className="shrink-0 leading-6">
                                        {item.icon}
                                    </span>
                                ) : null}

                                <Plus
                                    aria-hidden
                                    className={cn(
                                        'mt-1 size-4 shrink-0 text-slate-500 transition-transform duration-300',
                                        isOpen && 'rotate-45'
                                    )}
                                />
                            </button>
                        </h3>

                        <AnimatePresence initial={false}>
                            {isOpen ? (
                                <motion.div
                                    key="answer"
                                    id={`faq-answer-${key}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex justify-end">
                                        <p
                                            className={cn(
                                                'max-w-[88%] rounded-2xl rounded-br-sm bg-slate-900 px-5 py-4 text-sm leading-relaxed text-slate-100 sm:text-base',
                                                answerClassName
                                            )}
                                        >
                                            {item.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                );
            })}

            {timestamp ? (
                <p className="mt-2 text-right text-xs text-slate-500">{timestamp}</p>
            ) : null}
        </div>
    );
}
