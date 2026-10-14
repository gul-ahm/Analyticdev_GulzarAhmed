import type { ReceiptPlan } from '@/components/ui/ReceiptPricing';

// Three ways of buying, not three sizes of the same thing. A website is sold
// as a finished job for a fixed number. A web application and AI work are sold
// by the hour, because the hours depend on what the system has to do. Keeping
// those apart is the point of this page: a client should be able to tell in
// one glance which column is theirs.
// Values stay short so the receipt columns line up.
export const websitePlans: ReceiptPlan[] = [
    {
        id: 'website',
        name: 'Website',
        tagline: 'WordPress or fully coded',
        price: 35000,
        priceDisplay: '₹35,000 to ₹45,000',
        priceLabel: 'Fixed',
        priceNote: 'One number, agreed before the work starts',
        featured: true,
        cta: 'Start a website',
        href: '/contact',
        items: [
            { label: 'Built on', value: 'WordPress or code' },
            { label: 'Support', value: '1 month' },
            { label: 'Maintenance', value: '₹5,000 / month' },
            { label: 'Changes later', value: '₹500 / hour' },
            { label: 'Code + domain', value: 'Yours' }
        ]
    },
    {
        id: 'web-app',
        name: 'Web application',
        tagline: 'Logins, dashboards, payments',
        price: 700,
        priceDisplay: '₹700 to ₹800 / hr',
        priceLabel: 'Rate',
        priceNote: 'Hours estimated in writing before work starts',
        cta: 'Get an hours estimate',
        href: '/contact',
        items: [
            { label: 'Billing', value: 'By the hour' },
            { label: 'Support', value: '2 months' },
            { label: 'Domain + hosting', value: '1 year free' },
            { label: 'Maintenance', value: '2 months free' },
            { label: 'Code + domain', value: 'Yours' }
        ]
    },
    {
        id: 'ai-data',
        name: 'AI and data work',
        tagline: 'Agents, automation, ML, analytics',
        price: 10,
        priceDisplay: '$10 / hr',
        priceLabel: 'Rate',
        priceNote: 'Billed in INR at the rate on the invoice date',
        cta: 'Talk it through',
        href: '/contact',
        items: [
            { label: 'Covers', value: 'AI, ML, analytics' },
            { label: 'Billing', value: 'By the hour' },
            { label: 'Support', value: '1 month' },
            { label: 'Maintenance', value: '₹6,000 / month' },
            { label: 'Advice only', value: '₹2,500 / session' }
        ]
    }
];
