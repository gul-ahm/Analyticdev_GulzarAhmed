'use client';

// The carousel draws WebGL textures, so each review is painted onto a canvas
// first and handed over as an image. Nothing here is a photograph; the panels
// are the review cards themselves, rendered at texture resolution.

import * as React from 'react';
import LiquidGlassCarousel, { type LiquidGlassCarouselItem } from '@/components/ui/LiquidGlassCarousel';

type Review = {
    id: number | string;
    clientName: string;
    position?: string | null;
    content: string;
    rating: number;
};

const W = 900;
const H = 1200;
const PAD = 86;
const INK = '#0f172a';
const MUTED = '#64748b';
const LINE = '#e2e8f0';

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? r : r * 0.44;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

/** Greedy wrap; returns the lines that fit the given width. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > maxWidth && line) {
            lines.push(line);
            line = word;
            if (lines.length === maxLines) break;
        } else {
            line = next;
        }
    }
    if (lines.length < maxLines && line) lines.push(line);
    if (lines.length === maxLines && words.length) {
        const last = lines[maxLines - 1];
        if (ctx.measureText(last).width > maxWidth - 40) {
            lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 2))}...`;
        }
    }
    return lines;
}

function paint(review: Review): string {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const font = (size: number, weight = '400') =>
        `${weight} ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

    // rating
    const filled = Math.max(0, Math.min(5, Math.round(review.rating || 0)));
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i < filled ? INK : '#e2e8f0';
        star(ctx, PAD + 17 + i * 48, PAD + 18, 17);
    }

    // opening quote
    ctx.fillStyle = '#e2e8f0';
    ctx.font = font(150, '700');
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('“', PAD - 10, PAD + 190);

    // the words
    ctx.fillStyle = INK;
    ctx.font = font(44);
    const lines = wrap(ctx, review.content, W - PAD * 2, 12);
    const lineHeight = 66;
    let y = PAD + 250;
    for (const line of lines) {
        ctx.fillText(line, PAD, y);
        y += lineHeight;
    }

    // attribution, pinned to the bottom
    const footY = H - PAD - 80;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, footY - 46);
    ctx.lineTo(W - PAD, footY - 46);
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.font = font(38, '600');
    ctx.fillText(review.clientName, PAD, footY + 10);

    if (review.position) {
        ctx.fillStyle = MUTED;
        ctx.font = font(28);
        ctx.fillText(review.position.toUpperCase(), PAD, footY + 58);
    }

    return canvas.toDataURL('image/png');
}

export default function ReviewGlassWall({ reviews }: { reviews: Review[] }) {
    const [items, setItems] = React.useState<LiquidGlassCarouselItem[] | null>(null);

    React.useEffect(() => {
        if (!reviews.length) return;
        setItems(
            reviews.map((review) => ({
                src: paint(review),
                title: review.position ? `${review.clientName}, ${review.position}` : review.clientName,
                aspect: W / H
            }))
        );
    }, [reviews]);

    if (!reviews.length) return null;

    return (
        <div className="h-[78vh] min-h-[560px] w-full">
            {items ? (
                <LiquidGlassCarousel
                    items={items}
                    panelHeight={460}
                    gap={16}
                    background="#ffffff"
                    entry
                />
            ) : null}
        </div>
    );
}
