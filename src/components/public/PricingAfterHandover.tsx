import PlusCard from '@/components/ui/PlusCard';

const SITE = 'Website';
const APP = 'Web application';
const AI = 'AI and data work';

export default function PricingAfterHandover({ className = '' }: { className?: string }) {
    return (
        <section className={className} aria-labelledby="after-handover-heading">
            <div className="mb-10 max-w-2xl">
                <h2 id="after-handover-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    What it costs after handover
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Every one of these is optional. Nothing renews on its own and there is no
                    lock-in, because the code and the accounts are already yours.
                </p>
            </div>

            <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <PlusCard
                    className="lg:col-span-3 lg:row-span-2"
                    title="Maintenance"
                    description="Security updates, dependency upgrades, backups, uptime checks and small fixes. Anything that adds a feature counts as a change, not maintenance, and is quoted before it starts."
                    rows={[
                        { label: SITE, value: '₹5,000 per month' },
                        { label: APP, value: 'Free 2 months, then ₹8,000' },
                        { label: AI, value: '₹6,000 per month' }
                    ]}
                    footnote="Cancel whenever. There is no notice period and no minimum term."
                />

                <PlusCard
                    className="lg:col-span-3 lg:row-span-2"
                    title="Changes after delivery"
                    description="Once the free support window closes, new work is billed at the published hourly rate. You approve the hours before I start, the same way the original estimate worked."
                    rows={[
                        { label: SITE, value: '₹500 per hour' },
                        { label: APP, value: '₹700 to ₹800 per hour' },
                        { label: AI, value: '$10 per hour' }
                    ]}
                />

                <PlusCard
                    className="lg:col-span-2"
                    title="Free support window"
                    description="Anything that was meant to work and does not is fixed at no cost."
                    rows={[
                        { label: SITE, value: '1 month' },
                        { label: APP, value: '2 months' },
                        { label: AI, value: '1 month' }
                    ]}
                />

                <PlusCard
                    className="lg:col-span-2"
                    title="Advice without a build"
                    description="₹2,500 for a 90 minute working session, taken off the invoice if you go ahead with the project. The first 30 minute call is free either way."
                />
            </div>
        </section>
    );
}
