'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Search, PenTool, Code2, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: "First call",
        description: "Free, and no pitch. You tell me the problem and I tell you honestly whether I am the right person for it.",
        icon: Search,
    },
    {
        id: 2,
        title: "Fixed scope, number in writing",
        description: "You get the scope in writing and one number before anything starts. No hourly billing, no surprises at the end.",
        icon: PenTool,
    },
    {
        id: 3,
        title: "Build in the open",
        description: "A live link from the first week. You watch it come together instead of waiting for a demo at the end.",
        icon: Code2,
    },
    {
        id: 4,
        title: "Handover and after",
        description: "Code, domain and accounts go to you. I stay reachable after launch instead of going quiet once the invoice clears.",
        icon: Rocket,
    },
];

export default function ProcessTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="relative perspective-1000">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Mobile Scroll Controls */}
                <div className="flex justify-end gap-2 mb-4 lg:hidden">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    {/* Connecting Line - Aligned to center of icons (p-6 = 24px + half icon 24px = 48px) */}
                    <div className="absolute top-[48px] left-0 w-full h-[2px] bg-slate-200 hidden lg:block">
                        <motion.div
                            style={{ scaleX, transformOrigin: "0%" }}
                            className="absolute top-0 left-0 h-full w-full bg-slate-900"
                        />
                    </div>

                    <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-4 gap-4 lg:gap-8 pb-8 lg:pb-0 px-6 lg:px-0 -mx-6 lg:mx-0">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{
                                    duration: 1.0,
                                    delay: index * 0.18,
                                    type: "spring",
                                    bounce: 0.3
                                }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                    rotateX: 5,
                                    rotateY: 5,
                                    transition: { duration: 0.2 }
                                }}
                                className="relative flex flex-col group perspective-card h-full min-w-[80vw] lg:min-w-0 snap-center"
                            >
                                <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_20px_40px_-12px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_30px_60px_-12px_rgba(0,0,0,0.08)] group-hover:bg-white/80 h-full flex flex-col items-start text-left">
                                    <div className="mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            className={cn(
                                                "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white",
                                                "border-slate-900 text-slate-900 shadow-sm z-10 transition-colors duration-300",
                                                "group-hover:bg-slate-900 group-hover:text-white"
                                            )}>
                                            <step.icon className="h-5 w-5" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-lg font-bold leading-8 text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-base leading-7 text-slate-600">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
