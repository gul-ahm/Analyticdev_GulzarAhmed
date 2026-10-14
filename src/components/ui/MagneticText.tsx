'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface MagneticTextProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the pull is (default 0.5)
}

export default function MagneticText({
    children,
    className,
    strength = 0.5,
}: MagneticTextProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the return animation
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const distX = (clientX - centerX) * strength;
        const distY = (clientY - centerY) * strength;

        x.set(distX);
        y.set(distY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
