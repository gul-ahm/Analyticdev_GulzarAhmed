'use client';

import { motion, useInView } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
    variant?: "simple" | "blur" | "scale" | "slide";
    duration?: number;
    animationType?: "reveal" | "scrub";
    once?: boolean;
}

export default function ScrollReveal({
    children,
    width = "fit-content",
    className,
    delay = 0.2,
    variant = "blur",
    duration = 1.0,
    animationType = "reveal",
    once = true
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: once, margin: "-10% 0px -10% 0px" });

    // Anything already on screen when the page loads renders straight away.
    // Without this the first screen sits blank until the observer fires.
    const [atLoad, setAtLoad] = useState(false);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) setAtLoad(true);
    }, []);

    const show = atLoad || isInView;

    const variants = {
        simple: {
            hidden: { opacity: 0, filter: "blur(6px)" },
            visible: { opacity: 1, filter: "blur(0px)" }
        },
        blur: {
            hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
            visible: { opacity: 1, filter: "blur(0px)", y: 0 }
        },
        scale: {
            hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
            visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
        },
        slide: {
            hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
            visible: { opacity: 1, x: 0, filter: "blur(0px)" }
        }
    };

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "visible" }} className={className}>
            <motion.div
                variants={variants[variant]}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                transition={{
                    duration: atLoad ? 0 : duration,
                    delay: atLoad ? 0 : delay,
                    ease: [0.16, 1, 0.3, 1], // Slower, heavier easing (expo out)
                }}
                className="h-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
