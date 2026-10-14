import PlusCard from '@/components/ui/PlusCard';

const WIX = 'Wix or Shopify';
const AGENCY = 'Traditional agency';
const HERE = 'AnalyticsDev';

export default function PricingTco({ className = '' }: { className?: string }) {
    return (
        <section className={className} aria-labelledby="tco-heading">
            <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <PlusCard
                    className="lg:col-span-3 lg:row-span-2"
                    title="What three years actually costs"
                    description="Build fee, subscriptions, renewals and the cost of leaving, added up over 36 months."
                    rows={[
                        { label: WIX, value: '₹78,000 to ₹2,66,000' },
                        { label: AGENCY, value: '₹3,36,000 to ₹5,86,000' },
                        { label: HERE, value: '₹37,800 to ₹67,800', strong: true }
                    ]}
                    footnote="The range here is the website tier. Hourly work is not in this comparison, because it is not sold as a package."
                />

                <PlusCard
                    className="lg:col-span-2 lg:row-span-2"
                    title="Upfront build fee"
                    description="What you pay before anything is live."
                    rows={[
                        { label: WIX, value: '₹0 to ₹10,000' },
                        { label: AGENCY, value: '₹1,50,000 to ₹4,00,000' },
                        { label: HERE, value: '₹35,000 to ₹45,000', strong: true }
                    ]}
                />

                <PlusCard
                    className="lg:col-span-4"
                    title="Subscriptions over 36 months"
                    description="The line that quietly overtakes the build fee. A hosted builder charges every month for the privilege of staying online, and an agency retainer does the same under a different name. A static site on a free CDN tier costs nothing to keep running."
                    rows={[
                        { label: WIX, value: '₹75,000 to ₹2,50,000+' },
                        { label: AGENCY, value: '₹1,80,000+ in retainers' },
                        { label: HERE, value: '₹0 on free CDN hosting', strong: true }
                    ]}
                />

                <PlusCard
                    className="lg:col-span-2"
                    title="Domain renewal"
                    description="Three years of renewals."
                    rows={[
                        { label: WIX, value: '₹3,000 to ₹6,000' },
                        { label: AGENCY, value: '₹6,000 with markup' },
                        { label: HERE, value: '₹2,800 at cost', strong: true }
                    ]}
                />

                <PlusCard
                    className="lg:col-span-2"
                    title="Who owns the code"
                    description="What you walk away with if you leave."
                    rows={[
                        { label: WIX, value: 'Nothing, platform locked' },
                        { label: AGENCY, value: 'Usually the agency' },
                        { label: HERE, value: 'You, in full', strong: true }
                    ]}
                />
            </div>

            <div className="ml-auto mt-6 max-w-2xl px-4 text-right lg:-mt-20">
                <h2 id="tco-heading" className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    The cheap option is rarely the cheap one
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                    A builder subscription looks small next to a build fee, until you multiply it by
                    thirty six. These are list prices anyone can check, not quotes I have invented.
                </p>
            </div>
        </section>
    );
}
