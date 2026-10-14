import * as Icons from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: keyof typeof Icons;
    action?: {
        label: string;
        href: string;
    };
}

export default function EmptyState({ title, description, icon = 'Inbox', action }: EmptyStateProps) {
    // Cast Icons to allow string indexing safely
    const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[icon] || Icons.Inbox;

    return (
        <div className="text-center py-12">
            <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-100 p-3">
                    <IconComponent className="h-12 w-12 text-gray-400" />
                </div>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
            {action && (
                <div className="mt-6">
                    <a
                        href={action.href}
                        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    >
                        {action.label}
                    </a>
                </div>
            )}
        </div>
    );
}
