'use client';

import { motion, useInView } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file, otherwise remove

interface ScrollRevealTextProps {
    text: string | React.ReactNode;
    className?: string;
    variant?: 'word' | 'char';
    delay?: number;
    duration?: number;
}

export default function ScrollRevealText({
    text,
    className,
    variant = 'word',
    delay = 0,
    duration = 0.5,
}: ScrollRevealTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.2, once: true });

    // Text already on screen at load must not wait for the observer.
    const [atLoad, setAtLoad] = useState(false);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) setAtLoad(true);
    }, []);

    const show = atLoad || isInView;

    // Handle React Nodes (like <br/> or spans) by just wrapping them in a fade
    if (typeof text !== 'string') {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                variants={{
                    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: atLoad ? 0 : duration, delay: atLoad ? 0 : delay, ease: [0.2, 0.65, 0.3, 0.9] }}
                className={cn(className, "block min-h-[1.5em]")} // Fix: Add min-height to prevent layout shifts
            >
                {text}
            </motion.div>
        );
    }

    const items = variant === 'word' ? text.split(' ') : text.split('');

    return (
        <div ref={ref} className={cn('block', className)}>
            <motion.span
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                transition={{
                    staggerChildren: atLoad ? 0 : (variant === 'word' ? 0.03 : 0.01),
                    delayChildren: atLoad ? 0 : delay,
                    staggerDirection: 1
                }}
                className="block"
            >
                {items.map((item, i) => (
                    <motion.span
                        key={i}
                        className="inline-block whitespace-normal"
                        variants={{
                            hidden: {
                                opacity: 0,
                                y: '50%',
                                rotateX: -45,
                                filter: 'blur(8px)',
                                transition: { duration: 0.3 }
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                rotateX: 0,
                                filter: 'blur(0px)',
                                transition: {
                                    duration: duration,
                                    ease: [0.2, 0.65, 0.3, 0.9],
                                }
                            },
                        }}
                    >
                        {item === ' ' ? '\u00A0' : item}
                        {variant === 'word' && <span className="inline-block">&nbsp;</span>}
                    </motion.span>
                ))}
            </motion.span>
        </div>
    );
}
