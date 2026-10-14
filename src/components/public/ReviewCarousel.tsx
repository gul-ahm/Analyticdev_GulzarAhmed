'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Review {
    id: number;
    clientName: string;
    position?: string;
    content: string;
    rating: number;
    image?: string;
}

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll logic
    useEffect(() => {
        const startAutoPlay = () => {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 5000); // 5 seconds per slide
        };

        if (!isHovered) {
            startAutoPlay();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, reviews.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    if (!reviews || reviews.length === 0) return null;

    // Determine visible slides (Responsive: 1 on mobile, 2 on tablet, 3 on desktop)
    // For simplicity in this carousel, we'll slide one by one but show multiple if screen allows (handled by CSS/Grid usually, but here we do motion layout).
    // Let's stick to a robust single/preview layout or a 3-card window.
    // Given the "Horizontal scrolling" request, a row of 3 is good.

    // Better approach for "Cinematic":
    // Show 1 active card prominent, others faded.

    return (
        <div
            className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header Controls */}
            <div className="flex justify-end gap-2 mb-4">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm hover:shadow-md"
                    aria-label="Previous review"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm hover:shadow-md"
                    aria-label="Next review"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Carousel Track */}
            <div className="overflow-hidden py-10 -my-10"> {/* Negative margin to allow shadows */}
                <div className="relative h-[300px] md:h-[280px]">
                    <AnimatePresence mode='popLayout'>
                        {/* We render a window of cards based on currentIndex. 
                            Let's render 3 cards: Current, Next, Next+1 for desktop.
                        */}
                        {[0, 1, 2].map((offset) => {
                            const index = (currentIndex + offset) % reviews.length;
                            const review = reviews[index];

                            // Responsive visibility: 
                            // Mobile: Only show offset 0
                            // Tablet: Show 0, 1
                            // Desktop: Show 0, 1, 2

                            return (
                                <motion.div
                                    key={`${review.id}-${index}`}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        filter: 'blur(0px)',
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -100,
                                        filter: 'blur(10px)',
                                        scale: 0.9
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: offset * 0.1
                                    }}
                                    className={`
                                        absolute top-0 bottom-0 w-full md:w-[48%] lg:w-[32%]
                                        ${offset === 0 ? 'left-0 z-30' : ''}
                                        ${offset === 1 ? 'hidden md:block md:left-[51%] lg:left-[34%] z-20' : ''}
                                        ${offset === 2 ? 'hidden lg:block lg:left-[68%] z-10' : ''}
                                    `}
                                >
                                    <div className="h-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14}
                                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-100"}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-4 flex-grow text-sm md:text-base">
                                            "{review.content}"
                                        </p>

                                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                                            {review.image ? (
                                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                                    <Image
                                                        src={review.image}
                                                        alt={review.clientName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                                                    {review.clientName.charAt(0)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 text-sm truncate">{review.clientName}</div>
                                                <div className="text-xs text-slate-400 truncate">{review.position}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Dots */}
            <div className="flex md:hidden justify-center gap-2 mt-4">
                {reviews.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'}`}
                    />
                ))}
            </div>
        </div>
    );
}
