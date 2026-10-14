'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface CrowdCanvasProps {
    src: string;
    rows?: number;
    cols?: number;
    className?: string;
}

interface Peep {
    image: HTMLImageElement;
    rect: number[];
    width: number;
    height: number;
    x: number;
    y: number;
    anchorY: number;
    scaleX: number;
    walk: gsap.core.Timeline | null;
    setScale: (scale: number) => void;
    render: (ctx: CanvasRenderingContext2D) => void;
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = <T,>(array: T[]) => randomRange(0, array.length) | 0;
const removeFromArray = <T,>(array: T[], i: number) => array.splice(i, 1)[0];
const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item));
const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));

export default function CrowdCanvas({ src, rows = 15, cols = 7, className = '' }: CrowdCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const BOB = 10;
        // Each sprite cell leaves roughly this much empty space below the feet.
        // Without allowing for it the crowd floats above the bottom edge.
        const FOOT_PAD = 0.12;
        const stage = { width: 0, height: 0 };
        let peepHeight = 1;
        const allPeeps: Peep[] = [];
        const availablePeeps: Peep[] = [];
        const crowd: Peep[] = [];

        const createPeep = (image: HTMLImageElement, rect: number[]): Peep => {
            const peep: Peep = {
                image,
                rect,
                width: rect[2],
                height: rect[3],
                x: 0,
                y: 0,
                anchorY: 0,
                scaleX: 1,
                walk: null,
                setScale: (scale) => {
                    peep.width = rect[2] * scale;
                    peep.height = rect[3] * scale;
                },
                render: (c) => {
                    c.save();
                    c.translate(peep.x, peep.y);
                    c.scale(peep.scaleX, 1);
                    c.drawImage(peep.image, rect[0], rect[1], rect[2], rect[3], 0, 0, peep.width, peep.height);
                    c.restore();
                }
            };
            return peep;
        };

        // Drop each walker in off one edge, at a random distance from the viewer.
        // The offset never exceeds the room above a walker's head, so nobody is
        // clipped at the top, and never goes below zero, so nobody loses their feet.
        const placePeep = (peep: Peep) => {
            const goingRight = Math.random() > 0.5;
            const footPad = peep.height * FOOT_PAD;
            const room = Math.max(0, stage.height - peep.height + footPad - BOB);
            const offsetY = -room * (gsap.parseEase('power2.in') as (p: number) => number)(Math.random());
            const startY = stage.height - peep.height + footPad + offsetY;

            peep.scaleX = goingRight ? 1 : -1;
            peep.x = goingRight ? -peep.width : stage.width + peep.width;
            peep.y = startY;
            peep.anchorY = startY;

            return { startY, endX: goingRight ? stage.width : 0 };
        };

        const walk = (peep: Peep) => {
            const { startY, endX } = placePeep(peep);
            const xDuration = 10;
            const yDuration = 0.25;

            const tl = gsap.timeline();
            tl.timeScale(randomRange(0.5, 1.5));
            tl.to(peep, { duration: xDuration, x: endX, ease: 'none' }, 0);
            tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - BOB }, 0);
            return tl;
        };

        const addPeepToCrowd = () => {
            const peep = removeRandomFromArray(availablePeeps);
            peep.walk = walk(peep).eventCallback('onComplete', () => {
                removeItemFromArray(crowd, peep);
                availablePeeps.push(peep);
                addPeepToCrowd();
            });
            crowd.push(peep);
            crowd.sort((a, b) => a.anchorY - b.anchorY);
            return peep;
        };

        const initCrowd = () => {
            while (availablePeeps.length) {
                addPeepToCrowd().walk?.progress(Math.random());
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(devicePixelRatio, devicePixelRatio);
            crowd.forEach((peep) => peep.render(ctx));
            ctx.restore();
        };

        const resize = () => {
            stage.width = canvas.clientWidth;
            stage.height = canvas.clientHeight;
            canvas.width = stage.width * devicePixelRatio;
            canvas.height = stage.height * devicePixelRatio;

            // Scale the sprites so a whole walker, plus a little room to stand
            // further back, always fits inside the canvas.
            const scale = Math.min(1, (stage.height * 0.86) / peepHeight);
            allPeeps.forEach((peep) => peep.setScale(scale));

            crowd.forEach((peep) => peep.walk?.kill());
            crowd.length = 0;
            availablePeeps.length = 0;
            availablePeeps.push(...allPeeps);
            initCrowd();
        };

        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const rectWidth = img.naturalWidth / rows;
            const rectHeight = img.naturalHeight / cols;
            peepHeight = rectHeight;
            for (let i = 0; i < rows * cols; i++) {
                allPeeps.push(createPeep(img, [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight]));
            }
            resize();
            gsap.ticker.add(render);
        };
        img.src = src;

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(render);
            crowd.forEach((peep) => peep.walk?.kill());
        };
    }, [src, rows, cols]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
