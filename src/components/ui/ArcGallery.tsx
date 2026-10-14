'use client';

// Arc gallery, from 21st.dev. Adapted here: slate instead of indigo, no dark
// variants, cards link through to the project, and the broken-image fallback
// to a 21st.dev CDN asset is gone, since a dead external URL is worse than an
// empty frame.

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type ArcItem = { src: string; title: string; href: string };

type ArcGalleryProps = {
    items: ArcItem[];
    startAngle?: number;
    endAngle?: number;
    radiusLg?: number;
    radiusMd?: number;
    radiusSm?: number;
    cardSizeLg?: number;
    cardSizeMd?: number;
    cardSizeSm?: number;
    className?: string;
    children?: React.ReactNode;
};

export default function ArcGallery({
    items,
    startAngle = 20,
    endAngle = 160,
    radiusLg = 480,
    radiusMd = 360,
    radiusSm = 240,
    cardSizeLg = 132,
    cardSizeMd = 104,
    cardSizeSm = 76,
    className = '',
    children
}: ArcGalleryProps) {
    const [{ radius, cardSize }, setDimensions] = useState({ radius: radiusLg, cardSize: cardSizeLg });

    useEffect(() => {
        const onResize = () => {
            const w = window.innerWidth;
            if (w < 640) setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
            else if (w < 1024) setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
            else setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

    const count = Math.max(items.length, 2);
    const step = (endAngle - startAngle) / (count - 1);

    return (
        <section className={`relative overflow-hidden ${className}`}>
            <div className="relative mx-auto w-full" style={{ height: `${(radius * 1.18).toFixed(2)}px` }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    {items.map((item, i) => {
                        const angle = startAngle + step * i;
                        const rad = (angle * Math.PI) / 180;
                        return (
                            <div
                                key={item.href + i}
                                className="arc-card absolute opacity-0"
                                style={{
                                    width: `${cardSize}px`,
                                    height: `${cardSize}px`,
                                    // Fixed precision: the server and the client must
                                    // serialise these to the same string or React
                                    // reports a hydration mismatch.
                                    left: `calc(50% + ${(Math.cos(rad) * radius).toFixed(2)}px)`,
                                    bottom: `${(Math.sin(rad) * radius).toFixed(2)}px`,
                                    transform: 'translate(-50%, 50%)',
                                    animationDelay: `${i * 90}ms`,
                                    animationFillMode: 'forwards',
                                    zIndex: count - i
                                }}
                            >
                                <Link
                                    href={item.href}
                                    title={item.title}
                                    className="block h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                                    style={{ transform: `rotate(${(angle / 4).toFixed(2)}deg)` }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        loading="lazy"
                                        draggable={false}
                                        className="block h-full w-full object-cover"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {children ? (
                <div className="relative z-10 -mt-32 flex items-center justify-center px-6 md:-mt-44 lg:-mt-52">
                    <div className="arc-copy max-w-2xl px-6 text-center opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                        {children}
                    </div>
                </div>
            ) : null}

        </section>
    );
}
