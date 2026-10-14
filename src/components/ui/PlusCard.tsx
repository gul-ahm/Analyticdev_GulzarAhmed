// Bento card with corner plus marks, after the Ruixen bento cards on 21st.dev.
// The original wraps its content in a promo link back to ruixen.com; that is
// dropped here so the cards do not send visitors off the site.

import { cn } from '@/lib/utils';

export type PlusCardRow = { label: string; value: string; strong?: boolean };

interface PlusCardProps {
    title: string;
    description?: string;
    rows?: PlusCardRow[];
    footnote?: string;
    className?: string;
}

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        aria-hidden
        className={cn('size-6 text-slate-400', className)}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

export default function PlusCard({ title, description, rows, footnote, className }: PlusCardProps) {
    return (
        <div
            className={cn(
                'relative flex min-h-[180px] flex-col justify-between rounded-lg border border-dashed border-slate-300 bg-white p-6',
                className
            )}
        >
            <PlusIcon className="absolute -top-3 -left-3" />
            <PlusIcon className="absolute -top-3 -right-3" />
            <PlusIcon className="absolute -bottom-3 -left-3" />
            <PlusIcon className="absolute -bottom-3 -right-3" />

            <div className="relative z-10 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {description ? (
                    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                ) : null}

                {rows?.length ? (
                    <dl className="divide-y divide-slate-100 border-t border-slate-100 pt-1">
                        {rows.map((row) => (
                            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
                                <dt className="text-xs text-slate-500">{row.label}</dt>
                                <dd
                                    className={cn(
                                        'text-right text-sm tabular-nums',
                                        row.strong ? 'font-semibold text-slate-900' : 'text-slate-600'
                                    )}
                                >
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : null}
            </div>

            {footnote ? (
                <p className="relative z-10 mt-4 text-xs leading-relaxed text-slate-500">{footnote}</p>
            ) : null}
        </div>
    );
}
