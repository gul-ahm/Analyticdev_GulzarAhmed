'use client';

// Field primitives in the bordered, square-edged style of the reference form.
// Written here rather than pulled in, because this project has no shadcn
// Input, Label, Checkbox, Textarea, Separator or Button.

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
    return (
        <label
            className={cn('block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500', className)}
            {...props}
        />
    );
}

const fieldBase =
    'w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 ' +
    'transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ' +
    'disabled:cursor-not-allowed disabled:bg-slate-50';

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
    return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return <textarea className={cn(fieldBase, 'resize-y leading-relaxed', className)} {...props} />;
}

export function Separator({ className }: { className?: string }) {
    return <div role="separator" className={cn('h-px w-full bg-slate-200', className)} />;
}

export function Checkbox({ className, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type="checkbox"
            className={cn(
                'size-5 shrink-0 cursor-pointer appearance-none border border-slate-300 bg-white transition-colors',
                'checked:border-slate-900 checked:bg-slate-900',
                "checked:bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z'/%3e%3c/svg%3e\")] checked:bg-center checked:bg-no-repeat",
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
                className
            )}
            {...props}
        />
    );
}

export function Button({
    className,
    variant = 'solid',
    ...props
}: React.ComponentProps<'button'> & { variant?: 'solid' | 'outline' }) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-60',
                variant === 'solid'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'border border-slate-300 text-slate-900 hover:bg-slate-100',
                className
            )}
            {...props}
        />
    );
}

/** Label and control as one unit, so every form on the site spaces the same. */
export function Field({
    label,
    htmlFor,
    hint,
    children,
    className
}: {
    label: string;
    htmlFor?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <Label htmlFor={htmlFor}>{label}</Label>
            <div className="mt-2">{children}</div>
            {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
        </div>
    );
}
