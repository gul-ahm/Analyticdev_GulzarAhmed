'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SvgCarouselProps {
    svgs: string[];
    interval?: number; // Auto-play interval in ms
}

export default function SvgCarousel({ svgs, interval = 5000 }: SvgCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [sanitizedSvgs, setSanitizedSvgs] = useState<string[]>(svgs || []);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Client-side XSS Protection: Sanitize SVGs in browser to prevent jsdom SSR issues
    useEffect(() => {
        if (!svgs || svgs.length === 0) return;
        let isMounted = true;
        import('isomorphic-dompurify').then((mod) => {
            if (isMounted) {
                const purify = mod.default || mod;
                setSanitizedSvgs(svgs.map(svg => purify.sanitize(svg)));
            }
        }).catch(() => {
            if (isMounted) {
                setSanitizedSvgs(svgs);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [svgs]);

    // Auto-play logic
    useEffect(() => {
        if (svgs.length <= 1) return;

        const nextSlide = () => {
            setCurrentIndex((prev) => (prev + 1) % svgs.length);
        };

        if (!isHovered) {
            timerRef.current = setInterval(nextSlide, interval);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [svgs.length, interval, isHovered]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + svgs.length) % svgs.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % svgs.length);
    };

    if (!svgs || svgs.length === 0) return null;

    return (
        <div
            className="relative w-full max-w-md mx-auto group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* SVG Display Area */}
            <div className="relative overflow-visible h-[400px] flex items-center justify-center p-4">
                {sanitizedSvgs.map((svg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full text-white/90 flex items-center justify-center transition-opacity duration-700 ease-in-out p-4
                            ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                            [&>svg]:w-auto [&>svg]:h-auto [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:drop-shadow-2xl
                        `}
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                ))}
            </div>

            {/* Navigation Arrows (Only if multiple) */}
            {svgs.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 z-20"
                        aria-label="Previous SVG"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 z-20"
                        aria-label="Next SVG"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots Indicators */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {svgs.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-slate-700 w-4' : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
