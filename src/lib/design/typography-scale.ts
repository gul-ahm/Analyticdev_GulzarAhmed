/**
 * Luxury Typography Scale
 * 
 * Editorial-grade hierarchy with precise weights and spacing.
 * Optimized for heavyweight, premium feel.
 */

export const TYPOGRAPHY = {
    display: {
        size: 'text-7xl lg:text-9xl',
        weight: 'font-semibold',
        tracking: 'tracking-tighter',
        leading: 'leading-[0.85]',
        combined: 'text-7xl lg:text-9xl font-semibold tracking-tighter leading-[0.85]',
    },

    headline: {
        xl: {
            size: 'text-4xl md:text-6xl lg:text-7xl',
            weight: 'font-semibold',
            tracking: 'tracking-tight',
            leading: 'leading-[0.95]',
            combined: 'text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95]',
        },
        lg: {
            size: 'text-3xl md:text-5xl',
            weight: 'font-semibold',
            tracking: 'tracking-tight',
            leading: 'leading-tight',
            combined: 'text-3xl md:text-5xl font-semibold tracking-tight leading-tight',
        },
        md: {
            size: 'text-4xl md:text-6xl',
            weight: 'font-semibold',
            tracking: 'tracking-tight',
            leading: 'leading-[0.95]',
            combined: 'text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95]',
        }
    },

    body: {
        xl: {
            size: 'text-xl md:text-2xl',
            weight: 'font-normal',
            leading: 'leading-relaxed',
            combined: 'text-xl md:text-2xl font-normal leading-relaxed',
        },
        lg: {
            size: 'text-lg md:text-xl',
            weight: 'font-normal',
            leading: 'leading-relaxed',
            combined: 'text-lg md:text-xl font-normal leading-relaxed',
        },
        base: {
            size: 'text-base md:text-lg',
            weight: 'font-normal',
            leading: 'leading-relaxed',
            combined: 'text-base md:text-lg font-normal leading-relaxed',
        }
    },

    label: {
        weight: 'font-bold',
        tracking: 'tracking-[0.2em]',
        size: 'text-xs',
        combined: 'text-xs font-bold tracking-[0.2em] uppercase',
    },

    quote: {
        size: 'text-4xl md:text-6xl lg:text-7xl',
        weight: 'font-semibold',
        tracking: 'tracking-tight',
        leading: 'leading-[0.9]',
        combined: 'text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.9]',
    }
} as const;
