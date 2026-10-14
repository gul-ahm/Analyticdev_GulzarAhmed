'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface MagneticParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    color?: string;
}

export default function MagneticParticles({
    className = "",
    quantity = 60,
    staticity = 50,
    ease = 50,
    color = "#ffffff",
}: MagneticParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const rafID = useRef<number | null>(null);

    // Helpers
    const hexToRgb = (hex: string): string => {
        hex = hex.replace("#", "");
        if (hex.length === 3) {
            hex = hex.split("").map(char => char + char).join("");
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    };

    const remapValue = (value: number, start1: number, end1: number, start2: number, end2: number): number => {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    type Circle = {
        x: number;
        y: number;
        translateX: number;
        translateY: number;
        size: number;
        alpha: number;
        targetAlpha: number;
        dx: number;
        dy: number;
        magnetism: number;
    };

    const resizeCanvas = useCallback(() => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    }, [dpr]);

    const circleParams = useCallback((): Circle => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return { x, y, translateX, translateY, size, alpha, targetAlpha, dx, dy, magnetism };
    }, []);

    const drawCircle = useCallback((circle: Circle, update: boolean = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.current.translate(translateX, translateY);
            context.current.beginPath();
            context.current.arc(x, y, size, 0, 2 * Math.PI);
            context.current.fillStyle = `rgba(${hexToRgb(color)}, ${alpha})`;
            context.current.fill();
            context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!update) {
                circles.current.push(circle);
            }
        }
    }, [color, dpr]); // hexToRgb is stable

    const drawCircles = useCallback(() => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
            circles.current.forEach((circle: Circle, i: number) => {
                const edge = [
                    circle.x + circle.translateX - circle.size,
                    canvasSize.current.w - circle.x - circle.translateX - circle.size,
                    circle.y + circle.translateY - circle.size,
                    canvasSize.current.h - circle.y - circle.translateY - circle.size,
                ];
                const closestEdge = edge.reduce((a, b) => Math.min(a, b));
                const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

                if (remapClosestEdge > 1) {
                    circle.alpha += 0.02;
                    if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
                } else {
                    circle.alpha = circle.targetAlpha * remapClosestEdge;
                }

                circle.x += circle.dx;
                circle.y += circle.dy;
                circle.translateX += ((mouse.current.x / (staticity / circle.magnetism)) - circle.translateX) / ease;
                circle.translateY += ((mouse.current.y / (staticity / circle.magnetism)) - circle.translateY) / ease;

                if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size || circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) {
                    circles.current.splice(i, 1);
                    const newCircle = circleParams();
                    circles.current.push(newCircle);
                }

                drawCircle(circle, true);
            });
        }
    }, [circleParams, drawCircle, ease, staticity]);

    const animate = useCallback(() => {
        drawCircles();
        rafID.current = window.requestAnimationFrame(animate);
    }, [drawCircles]);

    const drawParticles = useCallback(() => {
        circles.current.length = 0;
        for (let i = 0; i < quantity; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    }, [quantity, circleParams, drawCircle]);

    const initCanvas = useCallback(() => {
        resizeCanvas();
        drawParticles();
        animate();
    }, [resizeCanvas, drawParticles, animate]);

    // Initial setup and Resize
    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();

        const handleResize = () => {
            if (canvasContainerRef.current && canvasRef.current && context.current) {
                // Resize logic duplicated here to avoid re-init full canvas with particles reset
                canvasSize.current.w = canvasContainerRef.current.offsetWidth;
                canvasSize.current.h = canvasContainerRef.current.offsetHeight;
                canvasRef.current.width = canvasSize.current.w * dpr;
                canvasRef.current.height = canvasSize.current.h * dpr;
                canvasRef.current.style.width = `${canvasSize.current.w}px`;
                canvasRef.current.style.height = `${canvasSize.current.h}px`;
                context.current.scale(dpr, dpr);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (rafID.current) {
                window.cancelAnimationFrame(rafID.current);
            }
        };
    }, [dpr, initCanvas]); // initCanvas deps are stable

    // Mouse Event Listener
    useEffect(() => {
        const container = canvasContainerRef.current;
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            if (container) {
                const { left, top } = container.getBoundingClientRect();
                mouse.current.x = clientX - left;
                mouse.current.y = clientY - top;
            }
        };

        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);

    return (
        <div ref={canvasContainerRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full z-0 overflow-hidden ${className}`}>
            <canvas ref={canvasRef} className="h-full w-full" />
        </div>
    );
}
