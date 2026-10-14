'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
    text: string;
    className?: string;
    splitBy?: 'word' | 'char';
    showAsterisk?: boolean;
    style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = '', splitBy = 'word', showAsterisk = false, style }: WordsPullUpProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const parts = splitBy === 'char' ? text.split('') : text.split(' ');

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
            {parts.map((part, i) => {
                const isLast = i === parts.length - 1;
                return (
                    <motion.span
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: i * (splitBy === 'char' ? 0.04 : 0.08), ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block relative"
                        style={{ marginRight: splitBy === 'char' || isLast ? 0 : '0.25em' }}
                    >
                        {part}
                        {showAsterisk && isLast && (
                            <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                        )}
                    </motion.span>
                );
            })}
        </span>
    );
};

interface Segment {
    text: string;
    className?: string;
}

interface WordsPullUpMultiStyleProps {
    segments: Segment[];
    className?: string;
    style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = '', style }: WordsPullUpMultiStyleProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    const words: { word: string; className?: string }[] = [];
    segments.forEach((seg) => {
        seg.text.split(' ').forEach((w) => {
            if (w) words.push({ word: w, className: seg.className });
        });
    });

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
            {words.map((w, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`inline-block ${w.className ?? ''}`}
                    style={{ marginRight: '0.25em' }}
                >
                    {w.word}
                </motion.span>
            ))}
        </span>
    );
};
