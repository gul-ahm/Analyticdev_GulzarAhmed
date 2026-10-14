'use client';

// Dotted world map with animated arcs, from 21st.dev. Adapted here: no
// next-themes (this site is light only), slate ink instead of sky blue, and
// the dot grid is a static file rather than a data URI generated per render.
// Regenerate it with: node scripts/build-world-dots.js

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type MapPoint = { lat: number; lng: number };
export type MapArc = { start: MapPoint; end: MapPoint };

interface WorldMapProps {
    arcs?: MapArc[];
    lineColor?: string;
    className?: string;
}

const projectPoint = (lat: number, lng: number) => ({
    x: (lng + 180) * (800 / 360),
    y: (90 - lat) * (400 / 180)
});

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 50} ${b.x} ${b.y}`;

function Pin({ point, color, delay }: { point: MapPoint; color: string; delay: number }) {
    const { x, y } = projectPoint(point.lat, point.lng);
    return (
        <g>
            <circle cx={x} cy={y} r="2.5" fill={color} />
            <circle cx={x} cy={y} r="2.5" fill={color} opacity="0.4">
                <animate attributeName="r" from="2.5" to="9" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
        </g>
    );
}

export default function WorldMap({ arcs = [], lineColor = '#0f172a', className = '' }: WorldMapProps) {
    const reduce = useReducedMotion();
    // Every point on the map, with no repeats, so a hub is not drawn twice.
    const pins = useMemo(() => {
        const seen = new Map<string, MapPoint>();
        for (const a of arcs) {
            for (const p of [a.start, a.end]) {
                seen.set(`${p.lat},${p.lng}`, p);
            }
        }
        return [...seen.values()];
    }, [arcs]);

    return (
        <div className={`relative w-full aspect-[2/1] font-sans ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/world-dots.svg"
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_12%,white_88%,transparent)]"
            />
            <svg viewBox="0 0 800 400" className="pointer-events-none absolute inset-0 h-full w-full select-none">
                <defs>
                    <linearGradient id="worldmap-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
                        <stop offset="12%" stopColor={lineColor} stopOpacity="1" />
                        <stop offset="88%" stopColor={lineColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {arcs.map((arc, i) => (
                    <motion.path
                        key={`arc-${i}`}
                        d={curve(projectPoint(arc.start.lat, arc.start.lng), projectPoint(arc.end.lat, arc.end.lng))}
                        fill="none"
                        stroke="url(#worldmap-arc)"
                        strokeWidth="1.2"
                        // Drawn on mount, not on scroll into view: the hero sits at the
                        // top of the page, and a throttled background tab leaves a
                        // whileInView path stuck at zero length with nothing on screen.
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.1, delay: 0.4 + 0.45 * i, ease: 'easeOut' }}
                    />
                ))}

                {pins.map((p, i) => (
                    <Pin key={`pin-${p.lat},${p.lng}`} point={p} color={lineColor} delay={i * 0.6} />
                ))}
            </svg>
        </div>
    );
}
