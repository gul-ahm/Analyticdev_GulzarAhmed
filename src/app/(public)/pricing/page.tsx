import type { Metadata } from 'next';
import TextRingFunnel from '@/components/ui/TextRingFunnel';
import ReceiptPricing from '@/components/ui/ReceiptPricing';
import PricingComparison from '@/components/public/PricingComparison';
import PricingIncluded from '@/components/public/PricingIncluded';
import PricingTco from '@/components/public/PricingTco';
import PricingAfterHandover from '@/components/public/PricingAfterHandover';
import PricingWindows from '@/components/public/PricingWindows';
import { websitePlans } from '@/lib/pricing-plans';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Website Development Pricing & Packages (INR) | Analytics Dev',
    description: 'Pricing for websites, web applications and AI work. A website is a fixed ₹35,000 to ₹45,000. Applications are ₹700 to ₹800 an hour and AI work is $10 an hour.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/pricing',
    },
    openGraph: {
        title: 'Website Development Pricing & Packages | Analytics Dev',
        description: 'Websites at a fixed ₹35,000 to ₹45,000. Web applications at ₹700 to ₹800 an hour, AI and data work at $10 an hour.',
        url: 'https://analyticsdev.xyz/pricing',
        type: 'website',
    },
};

const pricingSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "PriceSpecification",
            "@id": "https://analyticsdev.xyz/pricing#starter",
            "name": "Website",
            "minPrice": "35000",
            "maxPrice": "45000",
            "priceCurrency": "INR",
            "description": "A WordPress or fully coded business website for a fixed total, delivered in 2 to 3 weeks, with one month of support and the code and domain in the client's name."
        },
        {
            "@type": "PriceSpecification",
            "@id": "https://analyticsdev.xyz/pricing#growth",
            "name": "Web Application",
            "price": "700",
            "maxPrice": "800",
            "priceCurrency": "INR",
            "unitCode": "HUR",
            "description": "Custom web application work billed by the hour, with logins, dashboards and payments, two months of support and a free first year of domain and hosting."
        },
        {
            "@type": "PriceSpecification",
            "@id": "https://analyticsdev.xyz/pricing#custom",
            "name": "AI and Data Work",
            "price": "10",
            "priceCurrency": "USD",
            "unitCode": "HUR",
            "description": "AI agents, automation, machine learning and analytics work billed by the hour, with one month of support after handover."
        },
        {
            "@type": "FAQPage",
            "@id": "https://analyticsdev.xyz/pricing#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Are there any hidden costs after the website is built?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. The only costs that keep running are your domain registration, roughly ₹800 to ₹1,400 a year, and hosting, which is ₹0 a month on Vercel or Cloudflare at normal traffic. On a web application the first year of domain and hosting is on me. Maintenance is optional and priced in the table above. I charge no markup on third-party services and hand every account to you."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the payment milestone schedule?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A website is split across delivery milestones: 40% on signing the scope of work, 30% when you approve the working preview, and 30% on final testing and going live. Hourly work is billed every two weeks against a timesheet you can read, and you approve the estimated hours before any of it starts."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What happens if we need changes after launch?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A website carries one month of support, a web application two months, and AI work one month. Fixing something that was meant to work is part of that and costs nothing. After the window closes, changes are ₹500 an hour on a website, ₹700 to ₹800 an hour on an application and $10 an hour on AI work, or you can take the monthly maintenance instead."
                    }
                }
            ]
        }
    ]
};

export default function PricingPage() {
    return (
        <div className="text-slate-800">
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
            />

            <TextRingFunnel ringText="WEBSITES ₹35,000 TO ₹45,000 FIXED / APPS ₹700 AN HOUR / AI WORK $10 AN HOUR / ">
                <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
                    What a website costs here
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                    A website is one fixed number. A web application and AI work are billed by
                    the hour, because the hours follow what the system has to do.
                </p>
            </TextRingFunnel>

            <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

            {/* Breadcrumb & Freshness */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Pricing</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Updated for 2026 Rates (INR)
                    </span>
                </div>
            </div>

            <PricingComparison className="mb-16" />

            {/* 3-Tier Pricing Cards */}
            <ReceiptPricing plans={websitePlans} />

            <PricingTco className="mt-20" />

            <PricingWindows className="mt-20" />

            <PricingAfterHandover className="mt-20" />

            <PricingIncluded className="mt-20" />

            {/* Pricing FAQ */}
            <section className="mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                    Pricing & Engagement FAQs
                </h2>
                <div className="space-y-4">
                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            Are there any hidden costs after the website is built?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            No. The only costs that keep running are your domain registration, roughly ₹800 to ₹1,400 a year, and hosting, which is ₹0 a month on Vercel or Cloudflare at normal traffic. On a web application the first year of domain and hosting is on me. Maintenance is optional and priced in the table above. I charge no markup on third-party services and hand every account to you.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            What is the payment milestone schedule?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            A website is split across delivery milestones: 40% on signing the scope of work, 30% when you approve the working preview, and 30% on final testing and going live. Hourly work is billed every two weeks against a timesheet you can read, and you approve the estimated hours before any of it starts.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            What happens if we need changes after launch?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            A website carries one month of support, a web application two months, and AI work one month. Fixing something that was meant to work is part of that and costs nothing. After the window closes, changes are ₹500 an hour on a website, ₹700 to ₹800 an hour on an application and $10 an hour on AI work, or you can take the monthly maintenance instead.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="mt-16 p-8 rounded-2xl bg-slate-900 text-white text-center shadow-lg">
                <h3 className="text-2xl font-bold">Have a specific budget or deadline?</h3>
                <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
                    Let&apos;s talk. We will help you identify the highest-ROI features for your budget and deliver a written fixed-scope proposal in 24 hours.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/contact"
                        className="py-3 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        Request a Written Quote
                    </Link>
                    <Link
                        href="/services"
                        className="py-3 px-6 rounded-xl border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors"
                    >
                        See what is included
                    </Link>
                </div>
            </div>
            </div>
        </div>
    );
}
