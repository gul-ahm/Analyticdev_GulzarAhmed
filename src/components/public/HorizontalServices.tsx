'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, HelpCircle, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IService {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon?: string;
    features: string[];
}

const getIcon = (name: string) => {
    // @ts-ignore
    const Icon = LucideIcons[name];
    if (!Icon) return HelpCircle;
    return Icon;
};

interface HorizontalServicesProps {
    services?: IService[];
}

export default function HorizontalServices({ services = [] }: HorizontalServicesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const count = services?.length || 1;

    // Desktop Carousel Logic (Now Global)
    const nextSlide = () => {
        if (!services || services.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % count);
    };

    const prevSlide = () => {
        if (!services || services.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + count) % count);
    };

    return (
        <section className="relative md:sticky md:top-0 md:min-h-[100dvh] flex flex-col justify-center z-10 bg-white rounded-t-[3.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] py-12 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: Text Content */}
                    <div className="flex flex-col items-start text-left mb-8 lg:mb-0 order-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance mb-4"
                        >
                            How I can help
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-base text-slate-500 max-w-md leading-relaxed mb-8"
                        >
                            Four kinds of work. Pick the one that matches your problem, or tell me the problem and I will tell you which it is.
                        </motion.p>
                    </div>

                    {/* RIGHT COLUMN: 3D Carousel (Responsive) */}
                    <div className="w-full order-2 h-[450px] md:h-[600px] flex items-center justify-center relative">

                        <div className="relative w-full max-w-md mx-auto h-full flex items-center justify-center perspective-[1000px]">
                            {/* Navigation Controls */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 hover:bg-white/30 transition-all shadow-lg"
                                aria-label="Previous service"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 hover:bg-white/30 transition-all shadow-lg"
                                aria-label="Next service"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>

                            <div className="relative w-full h-full flex items-center justify-center">
                                <AnimatePresence mode='popLayout'>
                                    {services.map((service, index) => {
                                        const IconComponent = getIcon(service.icon || 'HelpCircle');
                                        // Better Logic: Render only visible ones or control all.
                                        let dist = index - currentIndex;
                                        if (dist > services.length / 2) dist -= services.length;
                                        if (dist < -services.length / 2) dist += services.length;

                                        const isActive = index === currentIndex;

                                        // Mobile optimization: Hide cards that are too far away
                                        if (!isActive && Math.abs(dist) > 1) return null;

                                        return (
                                            <motion.div
                                                key={service.id}
                                                className="absolute w-[85vw] sm:w-[320px] lg:w-[360px] bg-white/60 backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden border border-white/50"
                                                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.4,
                                                    scale: isActive ? 1 : 0.85,
                                                    zIndex: isActive ? 10 : 10 - Math.abs(dist),
                                                    x: isActive ? 0 : dist * 100, // Match ProjectCarousel spacing
                                                    rotateY: isActive ? 0 : dist * -15 // Match ProjectCarousel rotation
                                                }}
                                                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                                style={{ height: '450px', transformStyle: 'preserve-3d' }}
                                            >
                                                <div className="h-full flex flex-col p-6 sm:p-8 relative">
                                                    {/* Decorative Elements similar to Project Card */}
                                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                                        <IconComponent className="w-24 h-24 text-slate-900" />
                                                    </div>

                                                    <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-6 shadow-lg shadow-slate-900/20 relative z-10">
                                                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-3 relative z-10">
                                                        {service.title}
                                                    </h3>

                                                    <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-4 relative z-10">
                                                        {service.description}
                                                    </p>

                                                    <div className="w-full h-px bg-slate-200/50 mb-4 relative z-10" />

                                                    <div className="relative z-10">
                                                        <span className="text-xs font-semibold text-slate-400 mb-3 block">What you get</span>
                                                        <ul className="space-y-2">
                                                            {service.features.slice(0, 4).map((feature, i) => (
                                                                <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 shadow-[0_0_8px_rgba(99,102,241,0.6)] flex-none" />
                                                                    <span className="leading-snug">{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Pagination Dots */}
                            <div className="absolute -bottom-8 flex gap-2">
                                {services.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-slate-900 w-6' : 'bg-slate-300'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
