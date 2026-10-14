'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
// Local interface if global one is missing properties or strictly for this component
interface CarouselProject {
    id: string | number;
    title: string;
    description?: string;
    slug: string;
    tags: string[];
    images: string[];
}

export default function ProjectCarousel({ projects }: { projects: CarouselProject[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    // Helper to get visible projects (3 cards logic: Prev, Current, Next) for stacked feel
    // Actually, for a true stack, we often render all but control z-index and scale based on distance from current.
    // Let's use a simpler mapping approach for the stack effect.

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[450px] flex items-center justify-center perspective-[1000px]">
            {/* Navigation Controls - Absolute Sides */}
            <button
                onClick={prevSlide}
                className="absolute left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 hover:bg-white/30 transition-all shadow-lg"
                aria-label="Previous project"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 hover:bg-white/30 transition-all shadow-lg"
                aria-label="Next project"
            >
                <ArrowRight className="w-6 h-6" />
            </button>


            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode='popLayout'>
                    {projects.map((project, index) => {
                        // Calculate offset
                        // We want 3 cards visible: Current (0), Next (+1), and maybe Prev (-1) or just stack behind.
                        // Let's Implement a rigorous 3D stack: Current is front. Next/Prev are behind.

                        const offset = (index - currentIndex + projects.length) % projects.length;
                        // Normalize offset for direct neighbors
                        // Simple logic: if index === current return center styles

                        // Better Logic: Render only visible ones or control all.
                        // Let's use a simple condition: Only render current and next 2 for performance/visuals if many.

                        // Stack Logic based on Dribbble Ref:
                        // Active card is center.
                        // Cards "behind" are visible on right/left? No, usually stacked behind.
                        // Reference "Stacked Cards Carousel" usually implies a deck.

                        // Let's try finding the relative distance
                        let dist = index - currentIndex;
                        if (dist > projects.length / 2) dist -= projects.length;
                        if (dist < -projects.length / 2) dist += projects.length;

                        // We only show range -1 to 1 for generic standard, or let's try a strict stack.
                        // If standard simple carousel:
                        const isActive = index === currentIndex;

                        // We need a specific visual "Card" design first.
                        if (!isActive && Math.abs(dist) > 1) return null; // Optimization

                        return (
                            <motion.div
                                key={project.id}
                                className="absolute w-[280px] md:w-[320px] lg:w-[360px] bg-white/60 backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden border border-white/50"
                                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    scale: isActive ? 1 : 0.85,
                                    zIndex: isActive ? 10 : 10 - Math.abs(dist),
                                    x: isActive ? 0 : dist * 100, // Horizontal offset for neighbors
                                    rotateY: isActive ? 0 : dist * -15 // Slight rotation
                                }}
                                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                transition={{ type: "spring", stiffness: 100, damping: 40 }}
                                style={{
                                    height: '100%', // Use 100% of parent container which is responsive
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* CARD CONTENT Structure based on Reference */}
                                <div className="h-full flex flex-col">

                                    {/* TOP SECTION: Text (Flexible) */}
                                    <div className="flex-none p-6 pt-8 flex flex-col items-start justify-start flex-grow relative z-10">
                                        <div className="mb-4">
                                            <span className="text-xs font-semibold text-slate-400">
                                                {project.tags?.[0] || 'Strategy'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 line-clamp-4 text-balance">
                                            {project.title}
                                        </h3>

                                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed mb-3 max-w-[95%]">
                                            {project.description || 'A strategic digital solution optimizing performance and user engagement.'}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-2 content-start">
                                            {(project.tags || ['React', 'Node.js', 'Typescript', 'Tailwind']).slice(0, 3).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-md bg-white/50 border border-white/30 text-[9px] font-semibold text-slate-700 backdrop-blur-sm h-fit">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            href={`/projects/${project.slug}`}
                                            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors mt-6"
                                        >
                                            View Project
                                        </Link>
                                    </div>

                                    {/* BOTTOM SECTION: Image (Fixed Height / Shrinkable) */}
                                    <div className="h-40 shrink-0 relative overflow-hidden bg-slate-100 group">
                                        {/* Decorative Elements matching reference style (soft gradients/shapes) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />

                                        {project.images?.[0] ? (
                                            <img
                                                src={project.images[0]}
                                                alt={project.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <span className="text-xs">No image yet</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="absolute -bottom-10 flex gap-2">
                {projects.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-slate-900' : 'bg-slate-300'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

