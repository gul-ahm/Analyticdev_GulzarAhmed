'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Seven rings of readable words sit at fixed world depths. Each ring's screen
// radius and glyph size are both K1 * (1/z) of the same world constants, the
// standard single-point-perspective divide, so a ring twice as deep is both
// half the radius and half the type size.
//
// Nothing moves in z. The depth cue is angular: every ring spins at its own
// constant speed, fastest near and slowest far, so the phase gap between
// neighbours grows continuously. That growing lag is what reads as a tunnel.
//
// A ring's text is laid out once per resize by walking the circle and rotating
// the context per character, with widths measured offscreen and cached. The
// only per-frame cost is one extra rotate per ring.

const RING_COUNT = 7;
const Z_NEAR = 0.95;
const Z_FAR = 1.98;
const WORLD_R = 1;
const WORLD_GLYPH = 0.1;
const MIN_FONT_PX = 9;
const OMEGA_NEAR = 0.46;
const OMEGA_FAR = 0.09;
const STATIC_TIME = 2.2;
const MOTE_COUNT = 36;
const CONTENT_FEATHER_PX = 70;
const MAX_CHARS_PER_RING = 140;
const DT_MAX = 0.05;

const INK = '#0f172a';
const INK_FAINT = '#94a3b8';

interface TextRingFunnelProps {
    /** The phrase set as the ring text. Tiled to fill each circle. */
    ringText?: string;
    /** Headline and copy, centred at the vanishing point. */
    children?: ReactNode;
    className?: string;
}

export default function TextRingFunnel({ ringText = '', children, className = '' }: TextRingFunnelProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let dpr = 1;
        let sized = false;
        let ready = false;
        let disposed = false;
        let rootW = 0;
        let rootH = 0;
        let cx = 0;
        let cy = 0;

        type CharItem = { angle: number; ch: string };
        type Ring = {
            omega: number;
            angle: number;
            radiusPx: number;
            fontPx: number;
            color: string;
            alpha: number;
            layout: CharItem[];
        };
        let rings: Ring[] = [];

        const motes = Array.from({ length: MOTE_COUNT }, () => ({
            ringGap: Math.random() * (RING_COUNT - 1),
            theta: Math.random() * Math.PI * 2,
            drift: 0.04 + Math.random() * 0.08,
            r: 0.6 + Math.random() * 1.1
        }));

        // The children's measured box, used to fade rings out near the centre so
        // the headline stays readable.
        const content = contentRef.current;
        let contentRadiusPx = 0;
        const measureContent = () => {
            if (!content) return;
            const r = content.getBoundingClientRect();
            contentRadiusPx = Math.sqrt((r.width / 2) ** 2 + (r.height / 2) ** 2);
        };
        measureContent();
        const contentRO = content ? new ResizeObserver(measureContent) : null;
        if (content) contentRO?.observe(content);

        const measureCache = new Map<string, number>();
        const measureChar = (offCtx: CanvasRenderingContext2D, ch: string, fontPx: number, fontFamily: string) => {
            const key = `${fontPx}|${ch}`;
            const cached = measureCache.get(key);
            if (cached !== undefined) return cached;
            offCtx.font = `600 ${fontPx}px ${fontFamily}`;
            const w = Math.max(1, offCtx.measureText(ch).width);
            measureCache.set(key, w);
            return w;
        };

        const buildLayout = (offCtx: CanvasRenderingContext2D, radiusPx: number, fontPx: number, fontFamily: string) => {
            const layout: CharItem[] = [];
            const text = ringText.length ? ringText : ' ';
            let angle = 0;
            let i = 0;
            while (angle < Math.PI * 2 && layout.length < MAX_CHARS_PER_RING) {
                const ch = text[i % text.length];
                const charAngle = measureChar(offCtx, ch, fontPx, fontFamily) / radiusPx;
                if (ch !== ' ') layout.push({ angle: angle + charAngle / 2, ch });
                angle += charAngle;
                i++;
            }
            return layout;
        };

        let fontFamily = 'sans-serif';

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            if (width < 2 || height < 2) {
                sized = false;
                return;
            }
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            rootW = width;
            rootH = height;
            cx = width / 2;
            cy = height / 2;
            const K1 = Math.min(width, height) * 0.44;

            const offCtx = document.createElement('canvas').getContext('2d');
            fontFamily = getComputedStyle(canvas).fontFamily;
            measureCache.clear();

            rings = Array.from({ length: RING_COUNT }, (_, i) => {
                const z = Z_NEAR + (i * (Z_FAR - Z_NEAR)) / (RING_COUNT - 1);
                const ooz = 1 / z;
                const fontPx = Math.max(MIN_FONT_PX, K1 * ooz * WORLD_GLYPH);
                const radiusPx = Math.max(fontPx * 2.2, K1 * ooz * WORLD_R);
                const depthT = i / (RING_COUNT - 1);
                const far = depthT >= 0.5;
                return {
                    omega: OMEGA_NEAR + (OMEGA_FAR - OMEGA_NEAR) * depthT,
                    angle: rings[i]?.angle ?? Math.random() * Math.PI * 2,
                    radiusPx,
                    fontPx,
                    color: far ? INK_FAINT : INK,
                    alpha: far ? 0.85 - (depthT - 0.5) * 0.9 : 1 - depthT * 0.35,
                    layout: offCtx ? buildLayout(offCtx, radiusPx, fontPx, fontFamily) : []
                };
            });
            sized = true;
        };

        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        const onResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeTimer = null;
                resize();
                if (reduced) draw();
            }, 150);
        };

        const draw = () => {
            if (!sized) return;
            ctx.clearRect(0, 0, rootW, rootH);

            ctx.fillStyle = INK_FAINT;
            ctx.globalAlpha = 0.22;
            for (const m of motes) {
                const lo = Math.floor(m.ringGap);
                const hi = Math.min(RING_COUNT - 1, lo + 1);
                const t = m.ringGap - lo;
                const ringLo = rings[lo];
                const ringHi = rings[hi];
                if (!ringLo || !ringHi) continue;
                const rr = ringLo.radiusPx + (ringHi.radiusPx - ringLo.radiusPx) * t;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(m.theta) * rr, cy + Math.sin(m.theta) * rr, m.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Farthest first. Concentric circles never overlap in projected
            // radius, so draw order alone is a valid depth sort.
            for (let i = rings.length - 1; i >= 0; i--) {
                const ring = rings[i];
                if (!ring.layout.length) continue;

                let alpha = ring.alpha;
                if (contentRadiusPx > 0) {
                    const d = ring.radiusPx - contentRadiusPx;
                    if (d < -CONTENT_FEATHER_PX) continue;
                    if (d < CONTENT_FEATHER_PX) {
                        const t = Math.min(1, Math.max(0, (d + CONTENT_FEATHER_PX) / (2 * CONTENT_FEATHER_PX)));
                        alpha *= t * t * (3 - 2 * t);
                    }
                }
                if (alpha <= 0.02) continue;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(ring.angle);
                ctx.font = `600 ${ring.fontPx}px ${fontFamily}`;
                ctx.fillStyle = ring.color;
                ctx.globalAlpha = alpha;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (const item of ring.layout) {
                    ctx.save();
                    ctx.rotate(item.angle);
                    ctx.translate(0, -ring.radiusPx);
                    ctx.rotate(Math.PI / 2);
                    ctx.fillText(item.ch, 0, 0);
                    ctx.restore();
                }
                ctx.restore();
            }
            ctx.globalAlpha = 1;
        };

        let raf = 0;
        let last = 0;

        const loop = (now: number) => {
            const dt = last ? Math.min(DT_MAX, (now - last) / 1000) : 1 / 60;
            last = now;
            for (const ring of rings) ring.angle += ring.omega * dt;
            for (const m of motes) {
                m.theta += m.drift * dt;
                m.ringGap += dt * 0.12;
                if (m.ringGap > RING_COUNT - 1) m.ringGap -= RING_COUNT - 1;
            }
            draw();
            if (!document.hidden) raf = requestAnimationFrame(loop);
        };

        const run = () => {
            if (reduced || !ready || raf || document.hidden) return;
            last = 0;
            raf = requestAnimationFrame(loop);
        };
        const stop = () => {
            if (!raf) return;
            cancelAnimationFrame(raf);
            raf = 0;
        };

        // Only paint while the hero is on screen.
        const io = new IntersectionObserver(
            (entries) => (entries[0]?.isIntersecting ?? true ? run() : stop()),
            { threshold: 0 }
        );
        io.observe(root);

        const onVis = () => (document.hidden ? stop() : run());
        document.addEventListener('visibilitychange', onVis);

        const ro = new ResizeObserver(onResize);
        ro.observe(root);

        // Paint straight away with whatever font is available. Waiting on
        // document.fonts.ready alone leaves the canvas blank if that promise
        // settles before the effect gets to listen for it.
        resize();
        ready = true;
        // One paint up front, even in a background tab. Without it a page that
        // loads while hidden shows an empty canvas until the loop starts.
        draw();
        if (reduced) {
            // Freeze a beat past zero, so the differing speeds have already
            // pulled the rings out of phase.
            for (const ring of rings) ring.angle += ring.omega * STATIC_TIME;
            draw();
        } else {
            run();
        }

        // Re-measure once the real font lands, since glyph widths decide the layout.
        document.fonts.ready.then(() => {
            if (disposed) return;
            resize();
            if (reduced) draw();
        });

        return () => {
            disposed = true;
            stop();
            if (resizeTimer) clearTimeout(resizeTimer);
            io.disconnect();
            ro.disconnect();
            contentRO?.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, [ringText]);

    return (
        <div ref={rootRef} className={`relative isolate h-[100dvh] w-full overflow-hidden bg-white ${className}`}>
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />
            {/* The ring phrase is real copy set as geometry, so it is read once
                here. The canvas glyphs themselves are decorative paint. */}
            <span className="sr-only">{ringText.trim()}</span>
            {children ? (
                <div
                    ref={contentRef}
                    className="absolute left-1/2 top-1/2 flex w-full max-w-sm flex-col items-center gap-4 px-6 text-center"
                    style={{ transform: 'translate(-50%, -50%)' }}
                >
                    {children}
                </div>
            ) : null}
        </div>
    );
}
