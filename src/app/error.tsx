'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
            <div className="space-y-6 max-w-md">
                <h2 className="text-3xl font-bold text-slate-900 font-outfit">
                    Something went wrong!
                </h2>
                <p className="text-slate-600">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-700 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
