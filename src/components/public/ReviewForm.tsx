'use client';

// Same layout as the contact form, taken from the book-a-demo block: a bordered
// two-column grid with the fields on the left and the panel on the right. The
// panel says what happens to a review after it is sent, rather than carrying
// logos or a testimonial that is not mine to show.

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button, Field, Input, Separator, Textarea } from '@/components/ui/form-primitives';

export default function ReviewForm() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        content: '',
        rating: 5,
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/reviews/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', company: '', role: '', content: '', rating: 5, image: '' });
            } else {
                setError(data.error || 'Failed to submit review');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (file.size > 25 * 1024 * 1024) {
            setError('That file is over 25MB. Please pick a smaller one.');
            return;
        }
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (data.success) {
                setError('');
                setFormData((prev) => ({ ...prev, image: data.url }));
            } else {
                setError(data.error || 'The upload did not go through.');
            }
        } catch {
            setError('The upload did not go through.');
        }
    };

    return (
        <section className="w-full">
            <div className="space-y-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Worked with me
                </p>
                <h2 className="text-4xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                    Say how it actually
                    <br className="hidden md:block" /> went
                </h2>
            </div>

            <div className="mt-8 grid w-full border border-slate-200 bg-white lg:grid-cols-2">
                {success ? (
                    <div className="flex flex-col justify-center p-10 lg:border-r lg:border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">Thank you</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Your review is in. It goes up as you wrote it, once I have checked it
                            is not spam. Nothing gets edited.
                        </p>
                        <Button variant="outline" className="mt-6 self-start" onClick={() => setSuccess(false)}>
                            Write another
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-7 p-8 sm:p-10 lg:border-r lg:border-slate-200">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Your name" htmlFor="review-name">
                                <Input
                                    id="review-name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Field>
                            <Field label="Company, if any" htmlFor="review-company">
                                <Input
                                    id="review-company"
                                    name="company"
                                    type="text"
                                    placeholder="Where you work"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </Field>
                            <Field label="Your role, if any" htmlFor="review-role" className="sm:col-span-2">
                                <Input
                                    id="review-role"
                                    name="role"
                                    type="text"
                                    placeholder="Owner, operations lead, and so on"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Separator />

                        <fieldset>
                            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                How would you rate the work?
                            </legend>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            aria-label={`${star} out of 5`}
                                            aria-pressed={formData.rating === star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                                        >
                                            <Star
                                                size={26}
                                                className={
                                                    star <= formData.rating
                                                        ? 'fill-slate-900 text-slate-900'
                                                        : 'text-slate-300'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                                    {formData.rating} of 5
                                </span>
                            </div>
                        </fieldset>

                        <Separator />

                        <Field
                            label="What was it like working together?"
                            htmlFor="review-content"
                            hint="Include the parts that were hard. Those are the useful ones."
                        >
                            <Textarea
                                id="review-content"
                                name="content"
                                rows={5}
                                required
                                placeholder="What you needed, what you got, and whether the dates held."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </Field>

                        <Separator />

                        <fieldset>
                            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                A photo, if you want one shown
                            </legend>
                            <div className="mt-3 flex items-center gap-4">
                                {formData.image ? (
                                    <div className="group relative h-16 w-16 shrink-0 overflow-hidden border border-slate-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.image} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : null}
                                <div>
                                    <input
                                        type="file"
                                        id="public-review-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                    />
                                    <label
                                        htmlFor="public-review-upload"
                                        className="inline-flex cursor-pointer items-center border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                                    >
                                        Choose a photo
                                    </label>
                                    <p className="mt-1.5 text-xs text-slate-500">Up to 25MB. This is optional.</p>
                                </div>
                            </div>
                        </fieldset>

                        {error ? <p className="text-sm text-red-700">{error}</p> : null}

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Sending' : 'Post my review'}
                            <ArrowRight className="size-4" />
                        </Button>
                    </form>
                )}

                <div className="flex h-full w-full flex-col justify-between gap-8 border-t border-slate-200 p-8 sm:p-10 lg:border-t-0">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            What happens to it
                        </p>
                        <ol className="mt-5 space-y-5">
                            {[
                                ['Nothing is edited', 'It goes up in your words. I do not shorten reviews or soften them.'],
                                ['One check, for spam only', 'I read it to confirm it is a real person, not to approve what it says.'],
                                ['You can ask me to take it down', 'Any time, no reason needed. Write to me and it comes off the site.']
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
                            Not a client yet? There is nothing to review, but you can read the work
                            and what it costs.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <Link
                                href="/projects"
                                className="text-xs font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                            >
                                See the projects
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-xs font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                            >
                                See the rates
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
