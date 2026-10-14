'use client';

// Layout from the book-a-demo block on 21st.dev: a bordered two-column grid
// with the form on the left and the panel on the right, over a full-width CTA.
// The reference fills that panel with an Apple testimonial and a grid of
// company logos. Those are not clients of this studio, so the panel carries
// what is actually true instead: the published rates and what happens next.

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Checkbox, Field, Input, Separator, Textarea } from '@/components/ui/form-primitives';

const BUDGETS = ['Under ₹35,000', '₹35,000 to ₹45,000', '₹45,000 to ₹1,00,000', 'Above ₹1,00,000', 'Not sure yet'];
const KINDS = ['Website', 'Web application', 'AI or automation', 'Data work', 'Not sure yet'];

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [budget, setBudget] = useState('');
    const [kinds, setKinds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const toggleKind = (kind: string) =>
        setKinds((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // The extra answers ride along in the message, so the existing
        // /api/contact contract and its validation stay untouched.
        const extras = [
            kinds.length ? `Kind of work: ${kinds.join(', ')}` : '',
            budget ? `Budget: ${budget}` : ''
        ].filter(Boolean);
        const message = extras.length ? `${formData.message}\n\n---\n${extras.join('\n')}` : formData.message;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, message })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setBudget('');
                setKinds([]);
            } else {
                setError(data.error || 'Failed to submit message');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full">
            <div className="space-y-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Start a project
                </p>
                <h2 className="text-4xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                    Tell me what you are
                    <br className="hidden md:block" /> stuck on
                </h2>
            </div>

            <div className="mt-8 grid w-full border border-slate-200 lg:grid-cols-2">
                {success ? (
                    <div className="flex flex-col justify-center p-10 lg:border-r lg:border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">Message sent</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            It comes to me directly, not to a shared inbox. I reply to every
                            enquiry myself, usually the same day.
                        </p>
                        <Button variant="outline" className="mt-6 self-start" onClick={() => setSuccess(false)}>
                            Send another
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-7 p-8 sm:p-10 lg:border-r lg:border-slate-200">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Your name" htmlFor="name">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Gulzar Ahmed"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Field>
                            <Field label="Email" htmlFor="email">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </Field>
                            <Field label="Subject" htmlFor="subject" className="sm:col-span-2">
                                <Input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="A website for my clinic"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Separator />

                        <fieldset>
                            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                What do you need built? Pick any
                            </legend>
                            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {KINDS.map((kind) => (
                                    <label key={kind} className="flex cursor-pointer items-center gap-2.5">
                                        <Checkbox checked={kinds.includes(kind)} onChange={() => toggleKind(kind)} />
                                        <span className="text-sm text-slate-700">{kind}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <Separator />

                        <fieldset>
                            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                Budget you have in mind
                            </legend>
                            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {BUDGETS.map((band) => (
                                    <label key={band} className="flex cursor-pointer items-center gap-2.5">
                                        <input
                                            type="radio"
                                            name="budget"
                                            value={band}
                                            checked={budget === band}
                                            onChange={() => setBudget(band)}
                                            className="size-5 shrink-0 cursor-pointer accent-slate-900"
                                        />
                                        <span className="text-sm text-slate-700">{band}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <Separator />

                        <Field label="What are you trying to solve?" htmlFor="message">
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="A few lines is enough. What is slowing you down, and what would good look like?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </Field>

                        {error ? <p className="text-sm text-red-700">{error}</p> : null}

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Sending' : 'Send it'}
                            <ArrowRight className="size-4" />
                        </Button>
                    </form>
                )}

                <div className="flex h-full w-full flex-col justify-between gap-8 border-t border-slate-200 p-8 sm:p-10 lg:border-t-0">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            What happens next
                        </p>
                        <ol className="mt-5 space-y-5">
                            {[
                                ['I read it myself', 'There is no team and no ticket queue. Usually a reply the same day.'],
                                ['A free 30 minute call', 'We work out whether I am the right person. If I am not, I will say so.'],
                                ['A scope and a number, in writing', 'You read it before paying anything.']
                            ].map(([title, body], i) => (
                                <li key={title} className="flex gap-4">
                                    <span className="font-mono text-[10px] text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{title}</p>
                                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div>
                        <Separator className="mb-6" />
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            Published rates
                        </p>
                        <dl className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
                            {[
                                ['Website', '₹35,000 to ₹45,000, fixed'],
                                ['Web application', '₹700 to ₹800 per hour'],
                                ['AI and data work', '$10 per hour']
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt className="text-xs text-slate-500">{k}</dt>
                                    <dd className="text-sm font-medium text-slate-900">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <Link
                            href="/pricing"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                        >
                            See how each one is priced
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full border border-t-0 border-slate-200 p-12 text-center sm:p-16">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    Not ready to send anything?
                    <br />
                    Look at the work first.
                </h3>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/projects"
                        className="inline-flex items-center justify-center gap-2 border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                    >
                        Thirteen things I have built
                    </Link>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        What it costs
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
