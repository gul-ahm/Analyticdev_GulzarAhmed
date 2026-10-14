'use client';

import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ReceiptItem {
    label: string;
    /** Keep this short. A receipt column is a few characters wide. */
    value: string;
}

export interface ReceiptPlan {
    /** Seeds the order number and the barcode, so both stay the same between renders. */
    id: string;
    name: string;
    tagline?: string;
    price: number;
    /** Printed under the price, e.g. "fixed total" or "starting price". */
    priceNote: string;
    /** Replaces the TOTAL caption, so a quoted plan can read FROM instead. */
    priceLabel?: string;
    /** Printed in place of the formatted price, for a band or an hourly rate. */
    priceDisplay?: string;
    items: ReceiptItem[];
    cta: string;
    href: string;
    featured?: boolean;
}

interface ReceiptPricingProps {
    plans: ReceiptPlan[];
    merchant?: string;
    merchantNote?: string;
    orderPrefix?: string;
    showBarcode?: boolean;
    /** Milliseconds for one slip to print top to bottom. */
    printMs?: number;
    /** Milliseconds between slips, so the row prints left to right. */
    stagger?: number;
    toothWidth?: number;
    toothDepth?: number;
    /** 0 to 1. Strength of the thermal scan lines. 0 turns them off. */
    grain?: number;
    className?: string;
}

type Phase = 'idle' | 'hidden' | 'print';

const ENTER = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** FNV-1a. Small and stable, so a plan always prints the same order number. */
function hash(seed: string) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function bars(seed: string, count: number) {
    let h = hash(seed);
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
        h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
        out.push((h % 3) + 1);
    }
    return out;
}

function useReducedMotion() {
    const subscribe = React.useCallback((onChange: () => void) => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    return React.useSyncExternalStore(
        subscribe,
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        () => false
    );
}

// The first paint has to be a finished receipt, so hiding it before the print
// must happen before the browser paints.
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export default function ReceiptPricing({
    plans,
    merchant = 'Analytics Dev',
    merchantNote = 'Mumbai, India',
    orderPrefix = 'AD',
    showBarcode = true,
    printMs = 460,
    stagger = 60,
    toothWidth = 12,
    toothDepth = 6,
    grain = 0.05,
    className
}: ReceiptPricingProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const [phase, setPhase] = React.useState<Phase>('idle');

    // Slips already on screen print straight away. Anything below the fold waits
    // for the scroll, so the section prints when it is read.
    useIsoLayoutEffect(() => {
        const host = rootRef.current;
        if (!host || reduce) return;

        let t1 = 0;
        let t2 = 0;
        const total = printMs + stagger * Math.max(plans.length - 1, 0);
        const start = () => {
            t1 = window.setTimeout(() => setPhase('print'), 32);
            t2 = window.setTimeout(() => setPhase('idle'), 32 + total);
        };
        const stop = () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
        };

        setPhase('hidden');
        const box = host.getBoundingClientRect();
        if (box.top < window.innerHeight * 0.9 && box.bottom > 0) {
            start();
            return stop;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return;
                io.disconnect();
                start();
            },
            { threshold: 0.2 }
        );
        io.observe(host);
        return () => {
            io.disconnect();
            stop();
        };
    }, []);

    const money = React.useMemo(
        () => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
        []
    );

    return (
        <div
            ref={rootRef}
            className={cn(
                'flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0',
                className
            )}
        >
            {plans.map((plan, i) => (
                <ReceiptSlip
                    key={plan.id}
                    plan={plan}
                    phase={phase}
                    delay={stagger * i}
                    money={money}
                    merchant={merchant}
                    merchantNote={merchantNote}
                    orderPrefix={orderPrefix}
                    showBarcode={showBarcode}
                    printMs={printMs}
                    toothWidth={toothWidth}
                    toothDepth={toothDepth}
                    grain={grain}
                />
            ))}
        </div>
    );
}

interface ReceiptSlipProps {
    plan: ReceiptPlan;
    phase: Phase;
    delay: number;
    money: Intl.NumberFormat;
    merchant: string;
    merchantNote: string;
    orderPrefix: string;
    showBarcode: boolean;
    printMs: number;
    toothWidth: number;
    toothDepth: number;
    grain: number;
}

function ReceiptSlip({
    plan,
    phase,
    delay,
    money,
    merchant,
    merchantNote,
    orderPrefix,
    showBarcode,
    printMs,
    toothWidth,
    toothDepth,
    grain
}: ReceiptSlipProps) {
    const order = `${orderPrefix}-${(hash(plan.id) % 90000) + 10000}`;

    const paper: React.CSSProperties = {
        // Serrated top and bottom. Two 45 degree gradients cut a notch out of every
        // tile and a third fills the body, so the torn edge stays sharp at any width.
        ['--tooth-w' as string]: `${toothWidth}px`,
        ['--tooth-h' as string]: `${toothDepth * 2}px`,
        maskImage: MASK_LAYERS,
        maskSize: MASK_SIZE,
        maskPosition: MASK_POSITION,
        maskRepeat: MASK_REPEAT,
        WebkitMaskImage: MASK_LAYERS,
        WebkitMaskSize: MASK_SIZE,
        WebkitMaskPosition: MASK_POSITION,
        WebkitMaskRepeat: MASK_REPEAT,
        backgroundImage:
            grain > 0
                ? `repeating-linear-gradient(180deg, rgb(15 23 42 / ${grain}) 0 1px, transparent 1px 4px)`
                : undefined,
        ...phaseStyle(phase, delay, printMs)
    };

    return (
        <div
            className="w-[82vw] shrink-0 snap-center transition-transform duration-200 ease-out hover:-translate-y-0.5 sm:w-[20rem] lg:w-full"
            style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.06)) drop-shadow(0 10px 14px rgb(0 0 0 / 0.14))' }}
        >
            <article
                aria-label={`${plan.name} plan`}
                className="relative overflow-hidden border-x border-slate-200 bg-white px-5 pb-6 pt-7 font-mono text-slate-900"
                style={paper}
            >
                <header className="text-center">
                    <p className="text-[12px] font-semibold tracking-[0.3em]">{merchant.toUpperCase()}</p>
                    <p className="mt-1 text-[10px] tracking-[0.14em] text-slate-500">{merchantNote.toUpperCase()}</p>
                </header>

                <Rule className="mt-4" />

                <dl className="mt-2.5 flex justify-between gap-3 text-[10px] tracking-[0.1em] text-slate-500">
                    <dt>ORDER</dt>
                    <dd className="tabular-nums text-slate-900">{order}</dd>
                </dl>

                <Rule className="mt-2.5" />

                <div className="mt-3.5 text-center">
                    <h3 className="text-base font-semibold tracking-[0.18em]">{plan.name.toUpperCase()}</h3>
                    {plan.tagline ? (
                        <p className="mt-1 text-[10px] tracking-[0.1em] text-slate-500">{plan.tagline.toUpperCase()}</p>
                    ) : null}
                    {plan.featured ? (
                        <p className="mt-2 text-[10px] font-semibold tracking-[0.22em]">
                            <span aria-hidden="true">*** </span>RECOMMENDED<span aria-hidden="true"> ***</span>
                        </p>
                    ) : null}
                </div>

                <Rule className="mt-3.5" />

                <ul className="mt-3.5 space-y-1.5 text-[11px] tracking-[0.05em]">
                    {plan.items.map((item) => (
                        <li key={item.label} className="flex items-baseline gap-1.5">
                            <span className="shrink-0">{item.label.toUpperCase()}</span>
                            <span aria-hidden="true" className="min-w-3 flex-1 translate-y-[-0.28em] border-b border-dotted border-slate-400" />
                            <span className="shrink-0 tabular-nums">{item.value.toUpperCase()}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-3.5 border-t-[3px] border-double border-slate-400 pt-3">
                    <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[11px] font-semibold tracking-[0.1em]">{(plan.priceLabel ?? 'Total').toUpperCase()}</p>
                        <p className={cn(
                            'font-semibold tabular-nums',
                            (plan.priceDisplay ?? '').length > 11 ? 'text-sm' : 'text-lg'
                        )}>
                            {plan.priceDisplay ?? money.format(plan.price)}
                        </p>
                    </div>
                    <p className="mt-1 text-[10px] tracking-[0.1em] text-slate-500">{plan.priceNote.toUpperCase()}</p>
                </div>

                <Link
                    href={plan.href}
                    className={cn(
                        'mt-4 inline-flex h-10 w-full items-center justify-center rounded-md text-[11px] font-semibold tracking-[0.14em] transition-colors duration-200',
                        plan.featured
                            ? 'bg-slate-900 text-white hover:bg-slate-700'
                            : 'border border-slate-300 text-slate-900 hover:bg-slate-100'
                    )}
                >
                    {plan.cta.toUpperCase()}
                </Link>

                {showBarcode ? (
                    <div className="mt-5" aria-hidden="true">
                        <div className="mx-auto flex h-7 w-fit items-stretch">
                            {bars(order, 40).map((w, b) => (
                                <span key={b} className={b % 2 === 0 ? 'bg-slate-900' : ''} style={{ width: `${w}px` }} />
                            ))}
                        </div>
                        <p className="mt-1 text-center text-[10px] tracking-[0.22em] text-slate-500">{order}</p>
                    </div>
                ) : null}

                {/* The print head: a hairline riding the reveal edge, then gone. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={headStyle(phase, delay, printMs)} />
            </article>
        </div>
    );
}

function Rule({ className }: { className?: string }) {
    return <div aria-hidden="true" className={cn('border-t border-dashed border-slate-300', className)} />;
}

const MASK_LAYERS = [
    'linear-gradient(135deg, transparent 50%, black 0)',
    'linear-gradient(-135deg, transparent 50%, black 0)',
    'linear-gradient(black, black)',
    'linear-gradient(135deg, black 50%, transparent 0)',
    'linear-gradient(-135deg, black 50%, transparent 0)'
].join(', ');
const MASK_SIZE =
    'var(--tooth-w) var(--tooth-h), var(--tooth-w) var(--tooth-h), 100% calc(100% - var(--tooth-h)), var(--tooth-w) var(--tooth-h), var(--tooth-w) var(--tooth-h)';
const MASK_POSITION = '0 0, 0 0, 0 calc(var(--tooth-h) / 2), 0 100%, 0 100%';
const MASK_REPEAT = 'repeat-x, repeat-x, no-repeat, repeat-x, repeat-x';

function phaseStyle(phase: Phase, delay: number, printMs: number): React.CSSProperties {
    if (phase === 'hidden') return { clipPath: 'inset(0 0 100% 0)', transition: 'none' };
    if (phase === 'print') {
        return { clipPath: 'inset(0 0 0 0)', transition: `clip-path ${printMs}ms ${ENTER} ${delay}ms` };
    }
    return { clipPath: 'inset(0 0 0 0)' };
}

function headStyle(phase: Phase, delay: number, printMs: number): React.CSSProperties {
    const bar =
        'linear-gradient(to bottom, transparent 0%, transparent 86%, rgb(15 23 42 / 0.06) 97%, rgb(15 23 42 / 0.3) 100%)';
    if (phase === 'hidden') return { backgroundImage: bar, transform: 'translateY(-100%)', opacity: 1, transition: 'none' };
    if (phase === 'print') {
        return { backgroundImage: bar, transform: 'translateY(0)', opacity: 1, transition: `transform ${printMs}ms ${ENTER} ${delay}ms` };
    }
    return { backgroundImage: bar, transform: 'translateY(0)', opacity: 0, transition: 'opacity 160ms linear' };
}
