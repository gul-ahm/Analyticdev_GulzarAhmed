/**
 * Luxury Spacing Scale
 * 
 * Modular 8px base grid enforcing vertical rhythm and density.
 * Use these constants throughout the application for consistent spacing.
 */

export const SPACING = {
    // Base unit (8px)
    unit: 8,

    // Section padding (vertical rhythm)
    section: {
        mobile: 96,    // 12 units
        tablet: 128,   // 16 units  
        desktop: 160,  // 20 units
    },

    // Internal section spacing
    internal: {
        xs: 24,  // 3 units
        sm: 32,  // 4 units
        md: 48,  // 6 units
        lg: 64,  // 8 units
        xl: 96,  // 12 units
    },

    // Component gaps
    stack: {
        tight: 8,
        normal: 16,
        relaxed: 24,
    }
} as const;

// Helper function to convert to Tailwind classes
export const spacing = {
    section: {
        mobile: 'py-24',      // 96px
        tablet: 'md:py-32',   // 128px
        desktop: 'lg:py-40',  // 160px
        combined: 'py-24 md:py-32 lg:py-40',

        // Reduced versions for density
        mobileTight: 'py-16',      // 64px
        tabletTight: 'md:py-20',   // 80px
        desktopTight: 'lg:py-24',  // 96px
        combinedTight: 'py-16 md:py-20 lg:py-24',
    },

    internal: {
        xs: 'space-y-6',   // 24px
        sm: 'space-y-8',   // 32px
        md: 'space-y-12',  // 48px
        lg: 'space-y-16',  // 64px
        xl: 'space-y-24',  // 96px
    }
} as const;
