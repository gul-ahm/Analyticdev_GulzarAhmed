'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * HiggsfieldBackground - Interactive 3D/4D Particle Field
 * 
 * STRICT: Client-side only rendering via Canvas to prevent hydration mismatches.
 * - Simulates 3D depth without external libraries (Three.js/Fiber).
 * - Reacts to Mouse (Interaction) and Scroll (Velocity/Time).
 */
export default function HiggsfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles: Particle[] = [];
        const particleCount = 40; // Density
        let scrollY = window.scrollY;
        let targetScrollY = scrollY;

        // Mouse State
        const mouse = { x: width / 2, y: height / 2, active: false };

        // Resize Handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Scroll Handler
        const handleScroll = () => {
            targetScrollY = window.scrollY;
        };

        // Mouse Handlers
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        // 3D Particle Class
        class Particle {
            x: number;
            y: number;
            z: number;
            baseX: number;
            baseY: number;
            baseZ: number;
            size: number;
            color: string;
            speedX: number;
            speedY: number;
            speedZ: number;

            constructor() {
                this.x = Math.random() * width - width / 2;
                this.y = Math.random() * height - height / 2;
                this.z = Math.random() * 1000 + 100; // Depth 100 to 1100

                this.baseX = this.x;
                this.baseY = this.y;
                this.baseZ = this.z;

                this.size = Math.random() * 2 + 1;
                // Luxury Palette: Subtle Blue/Violet/Cyan
                const colors = ['rgba(148, 163, 184, ', 'rgba(203, 213, 225, ', 'rgba(100, 116, 139, '];
                this.color = colors[Math.floor(Math.random() * colors.length)];

                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.speedZ = (Math.random() - 0.5) * 1.5; // Z-axis movement (4D feel)
            }

            update(scrollVelocity: number) {
                // 4D Motion: Particles move through Z space
                this.z -= this.speedZ + (scrollVelocity * 0.1);

                // Reset Z if passed viewer or too far
                if (this.z < 1) this.z = 1000;
                if (this.z > 1000) this.z = 1;

                // Mouse interaction (Repulsion/Attraction)
                if (mouse.active) {
                    // Project mouse into 3D space rough approximation
                    const dx = mouse.x - (width / 2 + (this.baseX * 800) / this.z);
                    const dy = mouse.y - (height / 2 + (this.baseY * 800) / this.z);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = 300;
                    const force = (maxDistance - distance) / maxDistance;

                    if (distance < maxDistance) {
                        this.x -= forceDirectionX * force * 5;
                        this.y -= forceDirectionY * force * 5;
                    } else {
                        // Return to base slowly
                        if (this.x !== this.baseX) {
                            const dxBase = this.x - this.baseX;
                            this.x -= dxBase * 0.02;
                        }
                        if (this.y !== this.baseY) {
                            const dyBase = this.y - this.baseY;
                            this.y -= dyBase * 0.02;
                        }
                    }
                }
            }

            draw() {
                // Perspective Projection
                const focalLength = 800;
                const scale = focalLength / this.z;
                const screenX = width / 2 + this.x * scale;
                const screenY = height / 2 + this.y * scale;

                if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

                ctx!.beginPath();
                ctx!.arc(screenX, screenY, this.size * scale, 0, Math.PI * 2);

                // Depth Fogging (Alpha based on Z)
                const alpha = (1 - this.z / 1000) * 0.4; // Reduced for subtle effect
                ctx!.fillStyle = this.color + alpha + ')';
                ctx!.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const render = () => {
            // Smooth Scroll Velocity Calculation
            const dScroll = targetScrollY - scrollY;
            scrollY += dScroll * 0.1; // Lerp scroll
            const scrollVelocity = dScroll;

            // Clear with trail effect for "Ethereal" feel
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Light fade
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(scrollVelocity);
                p.draw();
            });

            // Connect nearby particles (Constellation effect)
            connectParticles();

            animationFrameId = requestAnimationFrame(render);
        };

        // A hidden tab still schedules work on some platforms, and the catch-up
        // burst on return lands right as the user starts scrolling.
        const onVisibility = () => {
            if (document.hidden) cancelAnimationFrame(animationFrameId);
            else animationFrameId = requestAnimationFrame(render);
        };
        document.addEventListener('visibilitychange', onVisibility);

        const connectParticles = () => {
            const focalLength = 800;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    // Use projected coordinates for distance check
                    const pA = particles[a];
                    const pB = particles[b];

                    // Simple Z check to optimize
                    if (Math.abs(pA.z - pB.z) > 200) continue;

                    const scaleA = focalLength / pA.z;
                    const xA = width / 2 + pA.x * scaleA;
                    const yA = height / 2 + pA.y * scaleA;

                    const scaleB = focalLength / pB.z;
                    const xB = width / 2 + pB.x * scaleB;
                    const yB = height / 2 + pB.y * scaleB;

                    const dx = xA - xB;
                    const dy = yA - yB;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = 1 - distance / 150;
                        ctx.strokeStyle = 'rgba(148, 163, 184,' + opacity * 0.25 + ')'; // Increased from 0.12
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(xA, yA);
                        ctx.lineTo(xB, yB);
                        ctx.stroke();
                    }
                }
            }
        };

        // Init
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);

        // Initial setup
        canvas.width = width;
        canvas.height = height;
        initParticles();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', onVisibility);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mounted]);

    if (!mounted) {
        return <div className="absolute inset-0 z-0 bg-slate-50" />;
    }

    return (
        <>
            {/* BASE LAYER: Static Background & Gradients (Behind Content) */}
            <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50" style={{ colorScheme: 'light' }}>

                {/* Alive Gradient Blobs (Pink & Sky Blue) */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full will-change-transform"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(249,168,212,0.20) 0%, rgba(249,168,212,0.09) 45%, rgba(249,168,212,0) 72%)'
                    }}
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full will-change-transform"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(203,213,225,0.26) 0%, rgba(203,213,225,0.12) 45%, rgba(203,213,225,0) 72%)'
                    }}
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* CSS Gradient Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-slate-100/10 to-slate-100/20 opacity-80" />

                {/* Noise Overlay (Background) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                {/* Vignette (Background) */}
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] mix-blend-hard-light pointer-events-none opacity-40"
                />
            </div>

            {/* OVERLAY LAYER: Interactive Particles (In Front of Content) */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-[50] pointer-events-none w-full h-full opacity-50 mix-blend-multiply"
                style={{ touchAction: 'none' }}
            />
        </>
    );
}
