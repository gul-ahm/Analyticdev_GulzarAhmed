import { useScroll, useVelocity, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * THE NERVOUS SYSTEM
 * 
 * Captures the "intent" of the user through scroll physics.
 * Distinguishes between:
 * - Idle (Breathing room)
 * - Reading (Slow scroll)
 * - Scanning (Fast scroll)
 */
export function useScrollIntelligence() {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const [scrollState, setScrollState] = useState<'idle' | 'reading' | 'scanning'>('idle');
    const [isResting, setIsResting] = useState(true);

    // Velocity-based state detection
    useMotionValueEvent(smoothVelocity, "change", (latest) => {
        const absVelocity = Math.abs(latest);

        if (absVelocity > 1500) {
            setScrollState('scanning');
            setIsResting(false);
        } else if (absVelocity > 50) {
            setScrollState('reading');
            setIsResting(false);
        } else {
            // We don't immediately set idle here to prevent flickering
            // We let the timeout handle true "rest"
        }
    });

    // Idle detection (The "Silence" logic)
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const unsubscribe = scrollVelocity.on("change", (latest) => {
            if (Math.abs(latest) < 50) {
                // If distinct movement stops, wait a moment before declaring "Life"
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    setIsResting(true);
                    setScrollState('idle');
                }, 150); // 150ms of stillness = Intentional Pause
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [scrollVelocity]);

    return {
        scrollY,
        velocity: smoothVelocity,
        scrollState,
        isResting
    };
}
