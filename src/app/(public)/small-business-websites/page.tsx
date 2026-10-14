import type { Metadata } from 'next';
import ReceiptPricing from '@/components/ui/ReceiptPricing';
import { websitePlans } from '@/lib/pricing-plans';
import Link from 'next/link';
import { CheckCircle2, XCircle, ShieldCheck, Code2, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Affordable Website Development for Small Businesses (Mumbai & India)',
    description: 'Website development for small businesses at a fixed ₹35,000 to ₹45,000, on WordPress or fully coded. 2 to 3 weeks delivery, zero vendor lock-in, full code and domain ownership.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/small-business-websites',
    },
    openGraph: {
        title: 'Affordable Website Development for Small Businesses | Analytics Dev',
        description: 'Small business websites from a fixed ₹35,000, larger builds from ₹45,000. Launch in 2 to 4 weeks on Next.js, with verified speed and complete code ownership.',
        url: 'https://analyticsdev.xyz/small-business-websites',
        type: 'website',
    },
};

const smallBusinessSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "FAQPage",
            "@id": "https://analyticsdev.xyz/small-business-websites#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is a cheaper website just a low-quality template?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. Cost is driven by scope, not quality. A ₹35,000 site and a ₹1,50,000 site can use the same framework, hosting, and security standards. The gap comes from the number of custom pages, integrations such as payments, booking, or CRM, and whether the design is built from scratch or adapted from a system. A website stays a fixed number because its pages are known in advance; anything with logins and dashboards is billed by the hour instead. Analytics Dev delivers every tier on Next.js with the same code review and performance standards."
                    }
                },
                {
                    "@type": "Question",
                    "name": "I don't know what I need. Will I be sold features I don't use?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Every engagement starts with a free 30-minute discovery call that produces a written scope of work listing every page, feature, and deliverable, with the agreed number on it. You receive that document before paying anything. Anything outside it is quoted separately and requires written approval. There is no hourly billing."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do I own my website and code after launch, or am I locked in?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You own the domain, source code, and hosting account from day one, registered in your name. The full repository is transferred at handover. Maintenance is an optional monthly plan you can cancel at any time, and you can move to another developer without permission or a release fee."
                    }
                }
            ]
        },
        {
            "@type": "ProfessionalService",
            "@id": "https://analyticsdev.xyz/#organization",
            "name": "Analytics Dev",
            "alternateName": "AnalyticsDev",
            "url": "https://analyticsdev.xyz",
            "email": "hello@analyticsdev.xyz",
            "description": "Founder-led web development and AI systems studio building websites and data systems for small businesses in India and the GCC.",
            "founder": {
                "@type": "Person",
                "name": "Gulzar Ahmed",
                "jobTitle": "Founder & Engineer",
                "sameAs": [
                    "https://linkedin.com/in/gul-ahm",
                    "https://github.com/gul-ahm"
                ]
            },
            "areaServed": [
                { "@type": "Country", "name": "India" },
                { "@type": "Country", "name": "Oman" },
                { "@type": "Country", "name": "United Arab Emirates" }
            ],
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
            },
            "priceRange": "₹₹",
            "knowsAbout": [
                "Web Development",
                "Next.js",
                "React",
                "Data Engineering",
                "Machine Learning",
                "Technical SEO"
            ]
        },
        {
            "@type": "Service",
            "@id": "https://analyticsdev.xyz/small-business-websites#service",
            "serviceType": "Small Business Website Development",
            "provider": { "@id": "https://analyticsdev.xyz/#organization" },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "minPrice": "35000",
                    "maxPrice": "45000",
                    "priceCurrency": "INR"
                }
            }
        }
    ]
};

export default function SmallBusinessWebsitesPage() {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-800">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(smallBusinessSchema) }}
            />

            {/* Breadcrumb & Freshness Marker */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Small Business Websites</span>
                </div>
                <div className="flex items-center gap-3">
                    <span>Published: Jan 2026</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Last updated: September 2026
                    </span>
                </div>
            </div>

            {/* Main H1 Title */}
            <header className="mb-12">
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-4">
                    Clear Scope · Fixed INR Pricing · 100% Code Ownership
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Website development for small businesses in Mumbai and across India
                </h1>

                {/* 43-word Answer-First Direct Extraction Paragraph */}
                <div className="mt-6 p-6 rounded-2xl bg-slate-100/70 border border-slate-200 text-slate-800 text-lg leading-relaxed shadow-sm">
                    <p className="font-medium text-slate-900">
                        A small business website is a fixed <strong className="text-slate-900 underline decoration-slate-300">₹35,000 to ₹45,000</strong>, on WordPress or fully coded, and launches in <strong className="text-slate-900">2 to 3 weeks</strong>. Analytics Dev is a founder-led studio in Mumbai building websites and AI systems for small businesses. The number is agreed in writing before work starts. You own the code and domain.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 block uppercase font-mono">Turnaround</span>
                        <span className="text-xl font-bold text-slate-900">14 to 28 Days</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 block uppercase font-mono">Core Tech</span>
                        <span className="text-xl font-bold text-slate-900">Next.js & React</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 block uppercase font-mono">Ownership</span>
                        <span className="text-xl font-bold text-slate-900">100% Client</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 block uppercase font-mono">Location</span>
                        <span className="text-xl font-bold text-slate-900">Mumbai, IN</span>
                    </div>
                </div>
            </header>

            {/* Section 1: Cost breakdown */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    How much does a small business website cost in 2026?
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    In 2026, a professionally built small business website in India sits around ₹35,000 to ₹45,000, whether it is built on WordPress or written from scratch. Cost is set by the number of pages and the integrations behind them. Once a site needs logins, dashboards or payments it stops being a website and becomes an application, which is why that work is billed by the hour instead.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    What&apos;s included at each price tier
                </h3>

                <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-xs bg-white">
                    <table className="w-full text-left text-sm border-collapse">
                        <caption className="sr-only">Small business website price tiers comparison table</caption>
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-semibold">
                                <th scope="col" className="p-4">Package Tier</th>
                                <th scope="col" className="p-4">Investment</th>
                                <th scope="col" className="p-4">Timeline</th>
                                <th scope="col" className="p-4">Best For</th>
                                <th scope="col" className="p-4">What&apos;s Included</th>
                                <th scope="col" className="p-4">What&apos;s Not Included</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="p-4 font-bold text-slate-900">WordPress website</td>
                                <td className="p-4 font-mono font-semibold text-slate-700">₹35,000</td>
                                <td className="p-4 text-slate-600">2 weeks</td>
                                <td className="p-4 text-slate-600">Local services, clinics, consultancies, MSMEs</td>
                                <td className="p-4 text-slate-600">Up to 5 custom pages, responsive UI, SEO metadata, contact form, analytics setup</td>
                                <td className="p-4 text-slate-400">Payment gateway, custom database, portal login</td>
                            </tr>
                            <tr className="bg-slate-50/50">
                                <td className="p-4 font-bold text-slate-900">Coded website</td>
                                <td className="p-4 font-mono font-semibold text-slate-700">₹45,000</td>
                                <td className="p-4 text-slate-600">3 weeks</td>
                                <td className="p-4 text-slate-600">Expanding brands, product catalogs, lead generation</td>
                                <td className="p-4 text-slate-600">Up to 10 pages, CMS blog, Razorpay/Stripe, speed optimization 95+ score, schema markup</td>
                                <td className="p-4 text-slate-400">Multi-tenant auth, custom ML models</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-bold text-slate-900">Web application</td>
                                <td className="p-4 font-mono font-semibold text-slate-700">₹700 to ₹800 / hour</td>
                                <td className="p-4 text-slate-600">4 weeks onwards</td>
                                <td className="p-4 text-slate-600">SaaS MVPs, client portals, custom workflow automation</td>
                                <td className="p-4 text-slate-600">Full custom web app, database, authentication, dashboard, webhook integrations</td>
                                <td className="p-4 text-slate-400">Enterprise SLA, dedicated server infrastructure</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8">
                    Hidden costs: domain, hosting, SSL, and renewals
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Many agencies hide annual running expenses. At Analytics Dev, we set up accounts directly in your name with zero markup. Realistic recurring annual costs in India:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-1">Domain Registration (.com / .in)</span>
                        <p className="text-sm text-slate-600">₹800 to ₹1,400 per year paid directly to Cloudflare, Porkbun, or Namecheap.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-1">Hosting & Global CDN</span>
                        <p className="text-sm text-slate-600">₹0/mo on Vercel/Cloudflare free tier for normal traffic, or approx ₹1,600/mo ($20) for high-traffic tiers.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-1">SSL Certificate</span>
                        <p className="text-sm text-slate-600">₹0 (Free forever via Let&apos;s Encrypt and Cloudflare auto-renewing SSL).</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-1">Maintenance & Updates</span>
                        <p className="text-sm text-slate-600">Optional ₹4,000 to ₹8,000/mo for ongoing changes, or pay per milestone only when needed.</p>
                    </div>
                </div>
            </section>

            {/* Section 2: Comparison */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Should you hire a freelancer, an agency, or use a website builder?
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    Website builders are ideal for DIY founders with budgets under ₹15,000, freelancers for simple single-task fixes, traditional agencies for high-overhead enterprise retainers, and studio engineers like Analytics Dev for fast, production-grade custom builds without agency overhead.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    When a website builder (Wix, Shopify) is genuinely the right call
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    If you are launching a testing concept in 48 hours and have under ₹15,000 total budget, use Shopify (for pure e-commerce retail) or Wix/Squarespace (for a simple personal brochure). The trade-off is monthly software lock-in ($29 to $79/month forever) and limited page speed optimization.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    When you actually need a custom build
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    You need a custom build on Next.js/React when search performance, mobile speed, brand credibility, ownership of your customer data, and zero monthly platform fees matter. A custom website built by Analytics Dev achieves a 95+ Google Lighthouse speed score, saving ongoing operational costs.
                </p>

                {/* Comparison Table */}
                <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-xs bg-white">
                    <table className="w-full text-left text-sm border-collapse">
                        <caption className="sr-only">Builder vs Freelancer vs Agency vs Analytics Dev comparison</caption>
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-semibold">
                                <th scope="col" className="p-3.5">Dimension</th>
                                <th scope="col" className="p-3.5">Website Builder</th>
                                <th scope="col" className="p-3.5">Freelancer</th>
                                <th scope="col" className="p-3.5">Traditional Agency</th>
                                <th scope="col" className="p-3.5 bg-slate-100/70 text-slate-950 font-bold">Analytics Dev</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="p-3.5 font-medium text-slate-900">Upfront Cost</td>
                                <td className="p-3.5 text-slate-600">₹0 to ₹10,000</td>
                                <td className="p-3.5 text-slate-600">₹15,000 to ₹40,000</td>
                                <td className="p-3.5 text-slate-600">₹1,50,000 to ₹5,00,000+</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-slate-900">₹35,000 to ₹45,000</td>
                            </tr>
                            <tr className="bg-slate-50/40">
                                <td className="p-3.5 font-medium text-slate-900">Monthly Platform Cost</td>
                                <td className="p-3.5 text-slate-600">₹1,800 to ₹6,500/mo</td>
                                <td className="p-3.5 text-slate-600">₹500 to ₹2,000/mo</td>
                                <td className="p-3.5 text-slate-600">₹10,000 to ₹25,000/mo</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-emerald-800">₹0 to ₹1,600/mo</td>
                            </tr>
                            <tr>
                                <td className="p-3.5 font-medium text-slate-900">Delivery Timeline</td>
                                <td className="p-3.5 text-slate-600">Self-paced (weeks)</td>
                                <td className="p-3.5 text-slate-600">3 to 8 weeks</td>
                                <td className="p-3.5 text-slate-600">8 to 16 weeks</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-slate-900">2 to 4 weeks guaranteed</td>
                            </tr>
                            <tr className="bg-slate-50/40">
                                <td className="p-3.5 font-medium text-slate-900">Code Ownership</td>
                                <td className="p-3.5 text-red-600">0% (Vendor locked)</td>
                                <td className="p-3.5 text-slate-600">Partial / Variable</td>
                                <td className="p-3.5 text-amber-700">Often withheld</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-emerald-700">100% (GitHub transfer)</td>
                            </tr>
                            <tr>
                                <td className="p-3.5 font-medium text-slate-900">Customization Ceiling</td>
                                <td className="p-3.5 text-slate-600">Low (Template limit)</td>
                                <td className="p-3.5 text-slate-600">Medium</td>
                                <td className="p-3.5 text-slate-600">High</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-slate-900">Unlimited (Next.js/React)</td>
                            </tr>
                            <tr className="bg-slate-50/40">
                                <td className="p-3.5 font-medium text-slate-900">Who Fixes Bugs?</td>
                                <td className="p-3.5 text-slate-600">You (DIY forum)</td>
                                <td className="p-3.5 text-slate-600">Uncertain availability</td>
                                <td className="p-3.5 text-slate-600">Account manager queue</td>
                                <td className="p-3.5 bg-slate-100/30 font-semibold text-slate-900">Direct Senior Engineer</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 3: Where to start */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    I don&apos;t know where to start. What&apos;s the first step?
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    The first step is a 30-minute discovery call to map your business model into a written 1-page Scope of Work with the agreed number on it, before you spend a single rupee. You do not need technical specifications or wireframes to get started.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    The 5 questions to answer before you request any quote
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-slate-700">
                    <li><strong className="text-slate-900">Who is your ideal customer?</strong> (e.g., local Mumbai clinics, GCC commercial contractors, B2B wholesale buyers).</li>
                    <li><strong className="text-slate-900">What single action should visitors take?</strong> (Call phone, book a consult, fill lead form, make a payment).</li>
                    <li><strong className="text-slate-900">What existing materials do you have?</strong> (Logo, product catalog, copy, domain name, or starting from scratch).</li>
                    <li><strong className="text-slate-900">What websites in your industry do you admire?</strong> (2 to 3 competitor links to establish visual benchmark).</li>
                    <li><strong className="text-slate-900">What is your launch deadline?</strong> (Hard launch date for a product rollout or marketing campaign).</li>
                </ol>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    What a proper scope of work document contains
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Before collecting any deposit, Analytics Dev provides a clear 2-page Scope of Work. It specifies:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <span className="font-semibold text-slate-900 block mb-1 text-sm">1. Exact Page Inventory</span>
                        <p className="text-xs text-slate-600">List of every URL, section, and interactive component delivered.</p>
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <span className="font-semibold text-slate-900 block mb-1 text-sm">2. Milestone Calendar</span>
                        <p className="text-xs text-slate-600">Firm calendar delivery dates for draft review and final deployment.</p>
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <span className="font-semibold text-slate-900 block mb-1 text-sm">3. One Agreed Number</span>
                        <p className="text-xs text-slate-600">One INR figure signed off up front, with no hourly or overage fees.</p>
                    </div>
                </div>
            </section>

            {/* Section 4: Timeline */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    How long does a small business website take to build?
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    A standard small business website takes between 14 and 28 calendar days from kickoff to live deployment on your custom domain. Analytics Dev uses milestone-based sprints to eliminate delivery delays.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    Week-by-week timeline
                </h3>
                <div className="relative border-l border-slate-200 pl-6 space-y-8 my-6">
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-white" />
                        <h4 className="text-base font-bold text-slate-900">Week 1: Discovery, Architecture & Content Structure</h4>
                        <p className="text-sm text-slate-600 mt-1">We finalize your sitemap, copywriting structure, visual theme, and domain DNS setup.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-white" />
                        <h4 className="text-base font-bold text-slate-900">Week 2: Component Engineering & Responsive Layout</h4>
                        <p className="text-sm text-slate-600 mt-1">Building responsive Next.js components, mobile optimization, and interactive forms.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-white" />
                        <h4 className="text-base font-bold text-slate-900">Week 3: Integrations & Technical SEO</h4>
                        <p className="text-sm text-slate-600 mt-1">Connecting CRM/WhatsApp lead routing, analytics, Google Search Console, and schema markup.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-white" />
                        <h4 className="text-base font-bold text-slate-900">Week 4: QA Testing, Core Web Vitals & Handover</h4>
                        <p className="text-sm text-slate-600 mt-1">Speed audit (95+ score), cross-browser verification, client sign-off, and repository transfer.</p>
                    </div>
                </div>
            </section>

            {/* Section 5: Ownership */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Do you own your website, code, and domain?
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    Yes, you own 100% of your domain, source code repository, and hosting accounts from day one with zero vendor lock-in. When the project launches, the complete GitHub codebase and domain access are transferred to your company.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    What vendor lock-in looks like and how to avoid it
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Unethical agencies hold domains hostage or host client sites on proprietary servers where code cannot be exported. If you leave, they demand thousands of rupees as a &quot;release fee&quot; or force you to rebuild from scratch. At Analytics Dev:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                            <span className="font-semibold text-slate-900 text-sm block">Registered in Your Name</span>
                            <span className="text-xs text-slate-600">Your domain, Vercel, and GitHub accounts are yours. You retain full administrative control.</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                            <span className="font-semibold text-slate-900 text-sm block">Portable Modern Tech</span>
                            <span className="text-xs text-slate-600">Built on Next.js/React. Any modern engineer in the world can maintain or extend the codebase.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: Red Flags */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    How to tell if you&apos;re being overcharged
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    You are being overcharged if an agency quotes open-ended hourly fees for standard 5-to-10 page websites, charges monthly markups on free SSL certificates, or hides source code ownership in the fine print.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">
                    Five red flags in a web development proposal
                </h3>
                <div className="space-y-3 mt-4">
                    {[
                        { title: '1. No written deliverables list', desc: 'A quote that says "website design - ₹75,000" without enumerating pages, integrations, and mobile breakpoints.' },
                        { title: '2. Recurring fees for free technologies', desc: 'Charging ₹5,000/year for SSL certificates or basic CDN caching that Cloudflare provides for free.' },
                        { title: '3. Agency owns the domain registrar', desc: 'Refusing to buy the domain directly under your PAN/business profile.' },
                        { title: '4. Vague "SEO Package" add-ons', desc: 'Billing ₹15,000/mo for "SEO" on a 5-page site without technical schema, indexation guarantee, or measurable deliverables.' },
                        { title: '5. No speed or performance guarantee', desc: 'Delivering bloated WordPress templates that load in 6+ seconds on mobile devices.' }
                    ].map((flag) => (
                        <div key={flag.title} className="p-4 bg-red-50/50 border border-red-100 rounded-lg flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-semibold text-slate-900 text-sm block">{flag.title}</span>
                                <span className="text-xs text-slate-600">{flag.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 7: Packages */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Our packages
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    A website is a fixed total, because its pages are known before the work starts.
                    A web application and AI work are billed by the hour against an estimate you
                    approve first. All three include direct founder-level engineering, responsive
                    mobile-first architecture, technical SEO, and complete handover.
                </p>

                <ReceiptPricing plans={websitePlans} className="mt-8" />
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="mt-16 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4 my-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            Is a cheaper website just a low-quality template?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            No. Cost is driven by scope, not quality. A ₹35,000 site and a ₹1,50,000 site can use the same framework, hosting, and security standards. The gap comes from the number of custom pages, integrations such as payments, booking, or CRM, and whether the design is built from scratch or adapted from a system. A website stays a fixed number because its pages are known in advance; anything with logins and dashboards is billed by the hour instead. Analytics Dev delivers every tier on Next.js with the same code review and performance standards.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            I don&apos;t know what I need. Will I be sold features I don&apos;t use?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            Every engagement starts with a free 30-minute discovery call that produces a written scope of work listing every page, feature, and deliverable, with the agreed number on it. You receive that document before paying anything. Anything outside it is quoted separately and requires written approval. There is no hourly billing.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-slate-900 shrink-0" />
                            Do I own my website and code after launch, or am I locked in?
                        </h3>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                            You own the domain, source code, and hosting account from day one, registered in your name. The full repository is transferred at handover. Maintenance is an optional monthly plan you can cancel at any time, and you can move to another developer without permission or a release fee.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA Bar */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white text-center shadow-lg">
                <h3 className="text-2xl font-bold">Ready to get an honest number in writing?</h3>
                <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">
                    Book a free 30-minute consultation. We will analyze your requirements and send a written scope of work with guaranteed turnaround and INR pricing within 24 hours.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/contact"
                        className="py-3 px-6 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Schedule Free Discovery Call
                    </Link>
                    <a
                        href="mailto:hello@analyticsdev.xyz"
                        className="py-3 px-6 rounded-xl border border-slate-600 text-slate-200 font-medium text-sm hover:bg-slate-800 transition-colors"
                    >
                        Email: hello@analyticsdev.xyz
                    </a>
                </div>
            </div>
        </div>
    );
}
