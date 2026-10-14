'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { Button, Field, Input, Separator, Textarea } from '@/components/ui/form-primitives';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        linkedin: '',
        resume: '',
        note: ''
    });
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState('');

    const { id } = use(params);

    useEffect(() => {
        let cancelled = false;
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                const data = await res.json();
                if (!cancelled && data.success) setJob(data.data);
            } catch {
                // leave job null; the not-found state below covers it
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchJob();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplying(true);
        setError('');

        // The note rides along with the resume link, so the existing
        // /api/applications contract stays untouched.
        const resume = formData.note
            ? `${formData.resume}\n\n---\n${formData.note}`
            : formData.resume;

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    linkedin: formData.linkedin,
                    resume,
                    job: id
                })
            });
            const data = await res.json();
            if (res.ok) {
                setApplied(true);
            } else {
                setError(data.error || 'The application did not go through.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="py-32 text-center text-sm text-slate-500">Loading this role</div>
        );
    }

    if (!job) {
        return (
            <div className="py-32 text-center">
                <p className="text-sm text-slate-600">This role is not open any more.</p>
                <Link
                    href="/careers"
                    className="mt-4 inline-block text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
                >
                    See what else is open
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-transparent py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-12">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            Open role
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                            {job.title}
                        </h1>
                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin aria-hidden size={16} />
                                {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Briefcase aria-hidden size={16} />
                                {job.type}
                            </span>
                            {job.salaryRange ? (
                                <span className="flex items-center gap-1.5">
                                    <IndianRupee aria-hidden size={16} />
                                    {job.salaryRange}
                                </span>
                            ) : null}
                            <span className="flex items-center gap-1.5">
                                <Clock aria-hidden size={16} />
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* What the role is */}
                    <div className="grid border border-slate-200 bg-white lg:grid-cols-3">
                        <div className="p-8 sm:p-10 lg:col-span-2 lg:border-r lg:border-slate-200">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                About the role
                            </p>
                            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                                {job.description}
                            </p>
                        </div>
                        <div className="border-t border-slate-200 p-8 sm:p-10 lg:border-t-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                What you need
                            </p>
                            {job.requirements?.length ? (
                                <ul className="mt-4 space-y-3">
                                    {job.requirements.map((req: string, idx: number) => (
                                        <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                                            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    Nothing fixed. Show me something you have built.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Application */}
                    <div id="apply" className="mt-16 space-y-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            Apply
                        </p>
                        <h2 className="text-4xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                            Four fields, that is
                            <br className="hidden md:block" /> the whole thing
                        </h2>
                    </div>

                    <div className="mt-8 grid w-full border border-slate-200 bg-white lg:grid-cols-2">
                        {applied ? (
                            <div className="flex flex-col justify-center p-10 lg:border-r lg:border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900">Application in</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    I read every one myself. If it is a fit you will hear from me, and
                                    if it is not I will still write back.
                                </p>
                                <Link
                                    href="/careers"
                                    className="mt-6 self-start text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                                >
                                    See the other roles
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-7 p-8 sm:p-10 lg:border-r lg:border-slate-200">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Your name" htmlFor="apply-name">
                                        <Input
                                            id="apply-name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Email" htmlFor="apply-email">
                                        <Input
                                            id="apply-email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </Field>
                                </div>

                                <Separator />

                                <Field
                                    label="Resume or portfolio link"
                                    htmlFor="apply-resume"
                                    hint="A Drive or Dropbox link, a personal site, a GitHub profile. Anything I can open."
                                >
                                    <Input
                                        id="apply-resume"
                                        name="resume"
                                        type="url"
                                        required
                                        placeholder="https://"
                                        value={formData.resume}
                                        onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                    />
                                </Field>

                                <Field label="LinkedIn, if you use it" htmlFor="apply-linkedin">
                                    <Input
                                        id="apply-linkedin"
                                        name="linkedin"
                                        type="url"
                                        placeholder="https://linkedin.com/in/"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </Field>

                                <Separator />

                                <Field
                                    label="Anything you want to add"
                                    htmlFor="apply-note"
                                    hint="Optional. One thing you built and what was hard about it is more useful than a cover letter."
                                >
                                    <Textarea
                                        id="apply-note"
                                        name="note"
                                        rows={4}
                                        placeholder="Tell me about one thing you have shipped."
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    />
                                </Field>

                                {error ? <p className="text-sm text-red-700">{error}</p> : null}

                                <Button type="submit" disabled={applying}>
                                    {applying ? 'Sending' : 'Send my application'}
                                    <ArrowRight className="size-4" />
                                </Button>
                            </form>
                        )}

                        <div className="flex h-full w-full flex-col justify-between gap-8 border-t border-slate-200 p-8 sm:p-10 lg:border-t-0">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                    How hiring works here
                                </p>
                                <ol className="mt-5 space-y-5">
                                    {[
                                        ['I read it, not a filter', 'There is no screening tool and no keyword match. One person reads every application.'],
                                        ['A call, then a small paid task', 'Real work, scoped to a few hours, and you are paid for it whatever the outcome.'],
                                        ['An answer either way', 'You will hear back even if the answer is no. No one gets left waiting.']
                                    ].map(([title, body], i) => (
                                        <li key={title} className="flex gap-4">
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
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
                                <p className="text-sm leading-relaxed text-slate-600">
                                    The studio is one engineer today. Read the work first, so you know
                                    what you would be joining.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    <Link
                                        href="/projects"
                                        className="text-xs font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                                    >
                                        The projects
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="text-xs font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                                    >
                                        About the studio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
