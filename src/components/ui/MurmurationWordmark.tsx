'use client';

// Murmuration wordmark, after the hero-03 block on 21st.dev. A 2D canvas draws
// a flock of starlings that folds on a curl-noise current and every few seconds
// converges into the word, holds it, then scatters. The pointer acts as a hawk.
// The stylesheet lives in globals.css rather than an inline <style>, so the
// server and client markup match.

import * as React from 'react';

export type MurmurationPreset = 'dusk' | 'dawn' | 'paper' | 'night';

export interface MurmurationWordmarkProps {
    /** The word the flock forms. Short and bold reads best. */
    word?: string;
    /** How many starlings. Scaled down on small screens. */
    birds?: number;
    preset?: MurmurationPreset;
    /** Colour overrides, merged over the preset. */
    palette?: { skyTop?: string; skyLow?: string; sun?: string; ink?: string };
    /** Seconds the flock flies free between formations. */
    flyFor?: number;
    /** Seconds the word holds once formed. */
    holdFor?: number;
    /** Seconds to pull the flock into the word. */
    gatherFor?: number;
    /** Seconds to scatter again. */
    releaseFor?: number;
    /** Reed line along the bottom. */
    reeds?: boolean;
    /** The pointer is a hawk the flock flees. */
    interactive?: boolean;
    fontFamily?: string;
    children?: React.ReactNode;
    /** Root height. A definite length, never a percentage. */
    height?: string;
    className?: string;
}

const PRESETS: Record<MurmurationPreset, { skyTop: string; skyLow: string; sun: string; ink: string }> = {
    dusk: { skyTop: '#1d2b44', skyLow: '#e89a6a', sun: '#ffd2a0', ink: '#14100f' },
    dawn: { skyTop: '#9fb4c9', skyLow: '#f3d6c2', sun: '#fff3df', ink: '#1f2329' },
    paper: { skyTop: '#efe9dd', skyLow: '#e6ddcc', sun: '#ffffff', ink: '#1a1714' },
    night: { skyTop: '#05070d', skyLow: '#1a2236', sun: '#4a5d86', ink: '#dfe6f5' }
};

// Seconds to gather into the word and to scatter again. Halved from the
// original, with flyFor and holdFor, so the whole cycle runs in about 6.6s
// instead of 13.2s and the word forms before a visitor scrolls past.
const GATHER = 1.2;
const RELEASE = 0.3;

const SANS_STACK = '"Inter Tight", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif';

/** Small seeded PRNG (mulberry32). */
function random(seed: number) {
    let a = seed >>> 0 || 1;
    return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Divergence-free current at (x, y) in unit space at time t: the curl of a sum
 * of travelling waves. Being a curl it never piles birds into a point or tears
 * holes in the flock, it only folds it.
 */
function curl(x: number, y: number, t: number) {
    const a = 1.7 * x + t;
    const b = 1.3 * y - 0.6 * t;
    const c = 2.9 * y + 1.1 * x - 0.8 * t;
    const d = 4.3 * x - 3.7 * y + 1.3 * t;
    const dpdx = 1.7 * Math.cos(a) * Math.cos(b) + 0.6 * 1.1 * Math.cos(c) - 0.35 * 4.3 * Math.sin(d);
    const dpdy = -1.3 * Math.sin(a) * Math.sin(b) + 0.6 * 2.9 * Math.cos(c) + 0.35 * 3.7 * Math.sin(d);
    return [dpdy, -dpdx];
}

/** The flock's wandering centre in unit space. */
function centre(t: number) {
    return [
        0.42 * Math.sin(t * 0.21) + 0.12 * Math.sin(t * 0.53 + 1),
        0.16 * Math.sin(t * 0.33 + 2) - 0.08
    ];
}

function ease(k: number) {
    const x = k < 0 ? 0 : k > 1 ? 1 : k;
    return x * x * (3 - 2 * x);
}

/**
 * Pair every bird with a target point. Targets are reused round-robin when
 * there are fewer points than birds, and the pairing is shuffled so the word
 * fills in from everywhere at once rather than letter by letter.
 */
function assign(birds: number, points: number, seed: number) {
    const out = new Int32Array(birds);
    if (points <= 0) return out.fill(-1);
    const order = new Int32Array(points);
    for (let i = 0; i < points; i++) order[i] = i;
    const rand = random(seed);
    for (let i = points - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }
    for (let i = 0; i < birds; i++) out[i] = order[i % points];
    return out;
}

/** A colour at an alpha, for #rgb / #rrggbb; anything else is returned as-is. */
function alpha(hex: string, a: number) {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
    if (!m) return hex;
    const h =
        m[1].length === 3
            ? m[1]
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : m[1];
    return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

export default function MurmurationWordmark({
    word = 'ANALYTICSDEV',
    birds = 4200,
    preset = 'paper',
    palette,
    flyFor = 3.5,
    holdFor = 1.6,
    gatherFor = GATHER,
    releaseFor = RELEASE,
    reeds = false,
    interactive = true,
    fontFamily = SANS_STACK,
    children,
    height = '100svh',
    className = ''
}: MurmurationWordmarkProps) {
    const colors = { ...(PRESETS[preset] || PRESETS.paper), ...(palette || {}) };
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const opts = React.useRef({ flyFor, holdFor, gatherFor, releaseFor, interactive });
    opts.current = { flyFor, holdFor, gatherFor, releaseFor, interactive };
    const key = [word, birds, colors.skyTop, colors.skyLow, colors.sun, colors.ink, reeds, fontFamily].join('|');

    React.useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let w = 1;
        let h = 1;
        let dpr = 1;
        let n = 0;
        let raf = 0;
        let visible = true;
        let sky: HTMLCanvasElement | null = null;
        let px = new Float32Array(0);
        let py = new Float32Array(0);
        let vx = new Float32Array(0);
        let vy = new Float32Array(0);
        let depth = new Float32Array(0);
        let phase = new Float32Array(0);
        let target = new Int32Array(0);
        let tx = new Float32Array(0);
        let ty = new Float32Array(0);
        let hx = -1e5;
        let hy = -1e5;
        let last = performance.now();
        let clock = 0;
        const rand = random(11);

        const layout = () => {
            const rect = root.getBoundingClientRect();
            w = Math.max(1, Math.round(rect.width));
            h = Math.max(1, Math.round(rect.height));
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);

            // Sky: a vertical gradient, a glow low on the horizon, grain.
            sky = document.createElement('canvas');
            sky.width = canvas.width;
            sky.height = canvas.height;
            const s = sky.getContext('2d');
            if (s) {
                s.setTransform(dpr, 0, 0, dpr, 0, 0);
                const g = s.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, colors.skyTop);
                g.addColorStop(0.78, colors.skyLow);
                g.addColorStop(1, colors.skyLow);
                s.fillStyle = g;
                s.fillRect(0, 0, w, h);
                const glow = s.createRadialGradient(w * 0.62, h * 0.86, 0, w * 0.62, h * 0.86, Math.max(w, h) * 0.55);
                glow.addColorStop(0, colors.sun);
                glow.addColorStop(0.25, alpha(colors.sun, 0.5));
                glow.addColorStop(1, alpha(colors.sun, 0));
                s.globalAlpha = 0.55;
                s.fillStyle = glow;
                s.fillRect(0, 0, w, h);
                s.globalAlpha = 1;
                const gr = random(5);
                for (let i = 0; i < (w * h) / 10; i++) {
                    s.fillStyle = gr() < 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.035)';
                    s.fillRect(gr() * w, gr() * h, 1, 1);
                }
                if (reeds) {
                    s.strokeStyle = colors.ink;
                    s.fillStyle = colors.ink;
                    const base = h - Math.max(6, h * 0.012);
                    s.fillRect(0, base, w, h - base);
                    for (let x = -10; x < w + 10; x += 2 + gr() * 9) {
                        if (gr() < 0.18) x += gr() * 30;
                        const tall = Math.pow(gr(), 1.6) * Math.max(34, h * 0.13) + 6;
                        const lean = (gr() - 0.3) * 10;
                        s.lineWidth = 0.6 + gr() * 1.2;
                        s.beginPath();
                        s.moveTo(x, base + 2);
                        s.quadraticCurveTo(x + lean * 0.3, base - tall * 0.6, x + lean, base - tall);
                        s.stroke();
                        if (gr() < 0.07) {
                            s.beginPath();
                            s.ellipse(x + lean, base - tall - 4, 1.8, 6, lean * 0.04, 0, Math.PI * 2);
                            s.fill();
                        }
                    }
                }
            }

            // The word, sampled into points on a 1x mask.
            const m = document.createElement('canvas');
            m.width = w;
            m.height = h;
            const mc = m.getContext('2d', { willReadFrequently: true });
            const pts: number[] = [];
            if (mc) {
                mc.font = `900 100px ${fontFamily}`;
                const wordW = mc.measureText(word || ' ').width || 1;
                const size = Math.min(((w * 0.74) / wordW) * 100, (h * 0.4) / 0.72);
                mc.font = `900 ${size}px ${fontFamily}`;
                mc.textAlign = 'center';
                mc.textBaseline = 'middle';
                mc.fillText(word || ' ', w / 2, h * 0.44);
                const img = mc.getImageData(0, 0, w, h).data;
                const step = Math.max(2, Math.round(Math.sqrt((w * h) / 90000)));
                for (let y = 0; y < h; y += step) {
                    for (let x = 0; x < w; x += step) {
                        if (img[(y * w + x) * 4 + 3] > 128) {
                            pts.push(x + (rand() - 0.5) * step, y + (rand() - 0.5) * step);
                        }
                    }
                }
            }
            tx = new Float32Array(pts.filter((_, i) => i % 2 === 0));
            ty = new Float32Array(pts.filter((_, i) => i % 2 === 1));

            // Scale the flock to the screen, then seed it as a loose cloud.
            const want = Math.round(
                Math.max(600, Math.min(9000, birds)) * Math.min(1, (w * h) / (1440 * 860))
            );
            if (want !== n) {
                n = Math.max(500, want);
                px = new Float32Array(n);
                py = new Float32Array(n);
                vx = new Float32Array(n);
                vy = new Float32Array(n);
                depth = new Float32Array(n);
                phase = new Float32Array(n);
                for (let i = 0; i < n; i++) {
                    const a = rand() * Math.PI * 2;
                    const r = Math.sqrt(rand());
                    px[i] = w * 0.5 + Math.cos(a) * r * w * 0.22;
                    py[i] = h * 0.4 + Math.sin(a) * r * h * 0.16;
                    depth[i] = 0.55 + rand() * 0.45;
                    phase[i] = rand() * Math.PI * 2;
                }
            }
            target = assign(n, tx.length, 23);
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            if (!visible) {
                last = now;
                return;
            }
            // Reduced motion: the flock is drawn but never moves.
            const dt = reduced ? 0 : Math.min(0.05, (now - last) / 1000);
            last = now;
            clock += dt;
            const o = opts.current;
            const gather = Math.max(0.2, o.gatherFor);
            const release = Math.max(0.2, o.releaseFor);
            const cycle = Math.max(1, o.flyFor) + gather + Math.max(0.5, o.holdFor) + release;
            const tc = clock % cycle;
            const fly = Math.max(1, o.flyFor);
            // 0 to 1 while forming, 1 while holding, back to 0 on release.
            let pull = 0;
            if (tc > fly && tc <= fly + gather) pull = ease((tc - fly) / gather);
            else if (tc > fly + gather && tc <= fly + gather + o.holdFor) pull = 1;
            else if (tc > fly + gather + o.holdFor) {
                pull = 1 - ease((tc - fly - gather - o.holdFor) / release);
            }

            const u = Math.min(w, h);
            const cen = centre(clock);
            const cxp = w / 2 + cen[0] * w * 0.5;
            const cyp = h * 0.42 + cen[1] * h;
            const t = clock * 0.35;
            const hawk = o.interactive && hx > -1e4;
            const hawkR = u * 0.16;

            for (let i = 0; i < n; i++) {
                const x = px[i];
                const y = py[i];
                let ax = 0;
                let ay = 0;
                // Free flight: the current folds the flock, the centre holds it together.
                const fx = (x - w / 2) / u;
                const fy = (y - h / 2) / u;
                const cv = curl(fx * 2.2 + depth[i] * 0.25, fy * 2.2, t);
                const free = 1 - pull;
                ax += cv[0] * 420 * free;
                ay += cv[1] * 420 * free;
                const dxC = cxp - x;
                const dyC = (cyp - y) * 1.6;
                const dC = Math.hypot(dxC, dyC) / u;
                const hold = dC < 0.14 ? 0.15 : 0.15 + (dC - 0.14) * 6;
                ax += dxC * hold * 2.2 * free;
                ay += dyC * hold * 1.6 * free;
                // Formation: spring to the bird's point in the word.
                const ti = target[i];
                if (pull > 0 && ti >= 0) {
                    ax += (tx[ti] - x) * 9 * pull - vx[i] * 3.2 * pull;
                    ay += (ty[ti] - y) * 9 * pull - vy[i] * 3.2 * pull;
                }
                // The hawk: a hard shove away inside its radius.
                if (hawk) {
                    const dx = x - hx;
                    const dy = y - hy;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < hawkR * hawkR) {
                        const d = Math.sqrt(d2) + 0.01;
                        const f = (1 - d / hawkR) * 5200;
                        ax += (dx / d) * f;
                        ay += (dy / d) * f;
                    }
                }
                let nvx = (vx[i] + ax * dt) * (1 - 1.1 * dt);
                let nvy = (vy[i] + ay * dt) * (1 - 1.1 * dt);
                const sp = Math.hypot(nvx, nvy);
                const cap = 520 + 380 * pull;
                if (sp > cap) {
                    nvx = (nvx / sp) * cap;
                    nvy = (nvy / sp) * cap;
                }
                vx[i] = nvx;
                vy[i] = nvy;
                px[i] = x + nvx * dt;
                py[i] = y + nvy * dt;
                phase[i] += dt * (9 + sp * 0.02);
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (sky) ctx.drawImage(sky, 0, 0);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Two depth passes so near birds read darker and heavier.
            for (let pass = 0; pass < 2; pass++) {
                ctx.beginPath();
                for (let i = 0; i < n; i++) {
                    const near = depth[i] > 0.78;
                    if ((pass === 1) !== near) continue;
                    const s = (1.6 + depth[i] * 2.2) * (1 - 0.35 * pull);
                    const sp = Math.hypot(vx[i], vy[i]) + 0.001;
                    const dx = vx[i] / sp;
                    const dy = vy[i] / sp;
                    const flap = 0.55 + 0.45 * Math.sin(phase[i]);
                    const bx = px[i];
                    const by = py[i];
                    // A "v": two wings swept back from the body, opening and closing.
                    const wx = -dx * s;
                    const wy = -dy * s;
                    const nx = -dy * s * flap;
                    const ny = dx * s * flap;
                    ctx.moveTo(bx + wx + nx, by + wy + ny);
                    ctx.lineTo(bx, by);
                    ctx.lineTo(bx + wx - nx, by + wy - ny);
                }
                ctx.strokeStyle = colors.ink;
                ctx.globalAlpha = pass === 0 ? 0.55 : 0.92;
                ctx.lineWidth = pass === 0 ? 0.9 : 1.25;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        const onMove = (e: PointerEvent) => {
            const b = canvas.getBoundingClientRect();
            hx = e.clientX - b.left;
            hy = e.clientY - b.top;
        };
        const onLeave = () => {
            hx = -1e5;
            hy = -1e5;
        };

        layout();
        raf = requestAnimationFrame(frame);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);
        const ro = new ResizeObserver(() => layout());
        ro.observe(root);
        const io = new IntersectionObserver((entries) => {
            visible = entries[0] ? entries[0].isIntersecting : true;
        });
        io.observe(root);
        let alive = true;
        if (document.fonts?.ready) {
            document.fonts.ready.then(() => {
                if (alive) layout();
            });
        }
        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            root.removeEventListener('pointermove', onMove);
            root.removeEventListener('pointerleave', onLeave);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return (
        <div
            ref={rootRef}
            className={`mmw-root ${className}`}
            style={{ height, ['--mmw-sky' as string]: colors.skyTop } as React.CSSProperties}
        >
            <canvas ref={canvasRef} aria-hidden="true" />
            <span className="mmw-sr">{word}</span>
            {children ? <div className="mmw-over">{children}</div> : null}
        </div>
    );
}
