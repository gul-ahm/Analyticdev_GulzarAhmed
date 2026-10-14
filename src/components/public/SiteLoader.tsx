'use client';

// Full screen loader over the home page. It renders on the server too, so it
// covers the page from the first paint rather than flashing the site first.
//
// Arriving at the site runs it in full. A refresh runs a short version. Moving
// between pages inside the site does not run it at all.

import * as React from 'react';
import MurmurationWordmark from '@/components/ui/MurmurationWordmark';

const FLY = 2;
const GATHER = 1;
const HOLD = 3;
const RELEASE = 2;

// Arrival: fly, gather and hold, then the fade overlaps the scatter.
const FULL_VISIBLE_MS = (FLY + GATHER + HOLD) * 1000;
const FULL_FADE_MS = RELEASE * 1000;

// Refresh: the word still completes at three seconds, then it goes.
const SHORT_VISIBLE_MS = 3000;
const SHORT_FADE_MS = 1000;

const SEEN_KEY = 'adv-loader-seen';

// Survives client side navigation within the same tab, so going back to the
// home page from another page does not replay it, not even for one frame.
let ranInThisRuntime = false;

export default function SiteLoader() {
    const [state, setState] = React.useState<'showing' | 'leaving' | 'hidden'>(
        ranInThisRuntime ? 'hidden' : 'showing'
    );
    const [fadeMs, setFadeMs] = React.useState(FULL_FADE_MS);

    React.useEffect(() => {
        if (ranInThisRuntime) return;
        ranInThisRuntime = true;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setState('hidden');
            return;
        }

        let reloaded = false;
        try {
            const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
            reloaded = entry?.type === 'reload';
        } catch {
            // older browsers: treat it as a fresh arrival
        }

        let seen = false;
        try {
            seen = sessionStorage.getItem(SEEN_KEY) === '1';
            sessionStorage.setItem(SEEN_KEY, '1');
        } catch {
            // blocked storage: fall back to the full run
        }

        // A tab that has already seen it, arriving again without a reload, is
        // coming from inside the site.
        if (seen && !reloaded) {
            setState('hidden');
            return;
        }

        const visible = reloaded ? SHORT_VISIBLE_MS : FULL_VISIBLE_MS;
        const fade = reloaded ? SHORT_FADE_MS : FULL_FADE_MS;
        setFadeMs(fade);

        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const toLeaving = window.setTimeout(() => setState('leaving'), visible);
        const toGone = window.setTimeout(() => {
            setState('hidden');
            document.body.style.overflow = '';
        }, visible + fade);

        return () => {
            window.clearTimeout(toLeaving);
            window.clearTimeout(toGone);
            document.body.style.overflow = '';
        };
    }, []);

    const dismiss = () => {
        setState('hidden');
        document.body.style.overflow = '';
    };

    if (state === 'hidden') return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading Analytics Dev"
            // inset-0 gives a definite box at exactly the viewport size, which is
            // what lets the canvas inside take a plain 100% and fit any screen.
            className="fixed inset-0 z-[9999] overflow-hidden bg-[#1d2b44]"
            style={{ opacity: state === 'leaving' ? 0 : 1, transition: `opacity ${fadeMs}ms linear` }}
        >
            <MurmurationWordmark
                word="ANALYTICSDEV"
                preset="dusk"
                reeds
                interactive={false}
                flyFor={FLY}
                gatherFor={GATHER}
                holdFor={HOLD}
                releaseFor={RELEASE}
                height="100%"
                className="h-full w-full"
            >
                <div className="flex h-full flex-col items-center justify-end px-6 pb-16 text-center sm:pb-24">
                    <p className="text-base font-light tracking-tight text-white/90 sm:text-xl md:text-2xl">
                        Hello, I am Gulzar from Analytics Dev
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50 sm:text-[10px]">
                        Websites, applications and AI work, Mumbai
                    </p>
                    <button
                        type="button"
                        onClick={dismiss}
                        data-interactive
                        className="mt-5 rounded-full border border-white/25 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
                    >
                        Skip
                    </button>
                </div>
            </MurmurationWordmark>
        </div>
    );
}
