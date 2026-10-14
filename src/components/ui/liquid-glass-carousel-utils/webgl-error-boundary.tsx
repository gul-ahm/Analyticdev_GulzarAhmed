'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function WebGLFallback({ className, message }: { className?: string; message?: string }) {
    return (
        <div className={cn('flex items-center justify-center px-6 text-center text-sm text-slate-500', className)}>
            {message ?? 'This needs WebGL, which is unavailable in this browser.'}
        </div>
    );
}

type Props = { children: React.ReactNode; fallback: React.ReactNode };

export class WebGLErrorBoundary extends React.Component<Props, { failed: boolean }> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: unknown) {
        console.error('WebGL carousel failed to start', error);
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}
