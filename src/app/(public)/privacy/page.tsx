
import type { Metadata } from 'next';
import ScrollReveal from '@/components/public/ScrollReveal';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy & Data Governance | Analytics Dev',
    description: 'Privacy policy and data governance commitment of Analytics Dev. Strict confidentiality, client code ownership, and DPDP compliance in Mumbai, India.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <div className="bg-transparent">
            {/* 1. HERO */}
            <div className="relative isolate overflow-hidden bg-white min-h-[45dvh] flex flex-col items-center justify-center pt-32 pb-16">
                <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#0f172a_100%)] opacity-5" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                    <div className="mx-auto max-w-3xl text-center">
                        <ScrollReveal variant="blur" animationType="scrub" width="100%">
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full mb-4 inline-block">
                                Transparency & Security
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-4">
                                Privacy Policy
                            </h1>
                            <p className="text-sm font-mono text-slate-500">
                                Effective Date: January 1, 2026 · Last Updated: September 2026
                            </p>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* 2. CONTENT */}
            <section className="relative z-10 bg-white min-h-[100dvh] flex flex-col justify-start rounded-t-[3.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] -mt-16 py-12 sm:py-20">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 w-full text-slate-700 space-y-8 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Executive Overview</h2>
                        <p className="text-base">
                            Analytics Dev (&quot;the Studio&quot;, &quot;we&quot;, &quot;us&quot;) is a founder-led engineering studio based in Mumbai, Maharashtra, India. We build web applications, AI systems, and cloud data infrastructure. We operate on a foundational principle: <strong>your proprietary data, source code, and customer records belong exclusively to you.</strong> We do not monetize personal data or deploy surveillance tracking.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Data We Collect</h2>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><strong>Direct Communication:</strong> Names, business emails, and project requirements submitted via our contact forms or email (<a href="mailto:hello@analyticsdev.xyz" className="text-slate-900 underline">hello@analyticsdev.xyz</a>).</li>
                            <li><strong>Telemetry & Usage:</strong> Privacy-preserving anonymized website analytics (e.g. pages viewed, referral source) to monitor performance. We do not use third-party advertising cookies or cross-site tracking pixels.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Client Project Confidentiality & Non-Disclosure</h2>
                        <p className="text-sm">
                            All proprietary data, application architectures, database schemas, and commercial strategies shared during discovery or active engineering engagements are treated with strict confidentiality. Non-Disclosure Agreements (NDAs) are executed prior to project kickoff.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Intellectual Property & Source Code Ownership</h2>
                        <p className="text-sm">
                            Unlike traditional agencies that retain ownership of code libraries or charge release fees, Analytics Dev transfers 100% of custom code repositories, assets, and hosting accounts directly to the client upon project completion.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Compliance & Data Protection Rights</h2>
                        <p className="text-sm">
                            We comply with applicable data protection legislation, including India&apos;s Digital Personal Data Protection Act (DPDP Act) and international principles (GDPR). You have the right to request access, correction, or permanent deletion of your contact records at any time by contacting us.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-200 text-sm">
                        <p className="font-semibold text-slate-900 mb-1">Contact Officer:</p>
                        <p>Gulzar Ahmed, Founder & Principal Engineer</p>
                        <p>Analytics Dev · Mumbai, Maharashtra, India</p>
                        <p>Email: <a href="mailto:hello@analyticsdev.xyz" className="text-slate-900 font-semibold underline">hello@analyticsdev.xyz</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}
