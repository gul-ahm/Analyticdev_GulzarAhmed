'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechStackCarouselProps {
    items: string[];
    className?: string;
}

export default function TechStackCarousel({ items, className }: TechStackCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Adjust scroll distance as needed
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className={cn("relative group w-full max-w-5xl mx-auto", className)}>
            {/* Left Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-white"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-white"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4 px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className="flex-none px-6 py-3 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-600 font-medium text-sm sm:text-base whitespace-nowrap hover:border-slate-200 hover:text-slate-900 hover:shadow-md transition-all select-none"
                    >
                        {item}
                    </div>
                ))}
            </div>

            {/* Gradient Masks for Fade Effect */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent" />
        </div>
    );
}
