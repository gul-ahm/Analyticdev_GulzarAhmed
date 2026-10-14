'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LivingItemProps {
    children: React.ReactNode;
    className?: string;
    /** Parallax Speed (0-1). Higher = Faster/More movement. */
    sensitivity?: number;
}

/**
 * LIVING ITEM (Parallax Wrapper)
 * 
 * Adds a subtle parallax effect to any section.
 * Uses Framer Motion's useScroll to track the element's position in the viewport
 * and applies a vertical, hardware-accelerated transform.
 */
export default function LivingItem({ children, className = "", sensitivity = 0.5 }: LivingItemProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Track scroll progress of this specific element relative to the viewport
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Map scroll progress (0 to 1) to Y translation suitable for parallax.
    // Negative start -> Positive end creates a "slower than scroll" illusion if background,
    // or "floating" feel for content.
    // Adjusted to be subtle based on sensitivity.
    const y = useTransform(scrollYProgress, [0, 1], [50 * sensitivity, -50 * sensitivity]);

    return (
        <div ref={ref} className={`relative isolate ${className}`}>
            {/* 
                We apply the parallax transform to a wrapper motion.div.
                Using 'will-change: transform' for performance.
            */}
            <motion.div
                style={{ y }}
                className="relative w-full h-full will-change-transform"
            >
                {children}
            </motion.div>
        </div>
    );
}
