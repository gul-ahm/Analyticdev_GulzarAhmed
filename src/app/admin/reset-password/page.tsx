'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Password reset successfully!');
                setTimeout(() => router.push('/admin/login'), 2000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong');
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-600">
                Invalid or missing reset token.
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="bg-green-50 text-green-800 p-6 rounded-md text-center">
                <h3 className="text-lg font-bold mb-2">Success!</h3>
                <p>{message}</p>
                <p className="text-sm mt-2">Redirecting to login...</p>
                <Link href="/admin/login" className="block mt-4 text-sm font-medium text-green-600 hover:text-green-500">
                    Go to Login now
                </Link>
            </div>
        );
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {message && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {message}
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label htmlFor="password" className="sr-only">New Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-700 focus:border-slate-700 sm:text-sm"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-700 focus:border-slate-700 sm:text-sm"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:opacity-70"
                >
                    {status === 'loading' ? 'Resetting...' : 'Set New Password'}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
