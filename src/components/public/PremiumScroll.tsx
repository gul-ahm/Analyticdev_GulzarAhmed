'use client';

import React, { useLayoutEffect, useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * The one scroll controller for the site.
 *
 * A long duration reads as floaty rather than heavy, because every wheel tick
 * restarts the easing and retargets mid-flight. Weight comes from the easing
 * curve instead: a fast start that settles slowly.
 */
export default function PremiumScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    // Use useLayoutEffect for immediate intialization to prevent FOUC/Jitter
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        // PREVENTION: Destroy any existing instance on the window to ensure singleton
        if ((window as any).lenis) {
            (window as any).lenis.destroy();
        }

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            // Touch is already smooth and momentum-aware. Driving it from rAF
            // fights the platform and is where the stutter on phones comes from.
            syncTouch: false,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Bind to window for global access/debugging
        (window as any).lenis = lenis;
        lenisRef.current = lenis;

        // The id has to be tracked per frame. Cancelling only the first one
        // leaves the loop running against a destroyed instance, and a second
        // mount then steps the easing twice per frame, which reads as jitter.
        let rafId = 0;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            (window as any).lenis = null;
        };
    }, []);

    return (
        <>
            {children}
            {/* Global Scroll Styles - Enforce native-like behavior where needed */}
            <style jsx global>{`
                html.lenis, html.lenis body {
                    height: auto;
                }
                .lenis.lenis-smooth {
                    scroll-behavior: auto !important;
                }
                .lenis.lenis-smooth [data-lenis-prevent] {
                    overscroll-behavior: contain;
                }
                .lenis.lenis-stopped {
                    overflow: hidden;
                }
                .lenis.lenis-scrolling iframe {
                    pointer-events: none;
                }
            `}</style>
        </>
    );
}
