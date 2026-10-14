import { Star } from 'lucide-react';
import * as reviewRepo from '@/lib/repositories/review.repository';

export const dynamic = 'force-dynamic';

async function getFeaturedReviews() {
    try {
        const reviews = await reviewRepo.findAllReviews(true);
        // Get featured reviews, limit to 3
        return reviews.filter(r => r.featured).slice(0, 3);
    } catch (error) {
        return [];
    }
}

export default async function ReviewsSection() {
    const reviews = await getFeaturedReviews();

    if (reviews.length === 0) return null;

    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        What Our Clients Say
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Trusted by businesses worldwide
                    </p>
                    <div className="mt-8">
                        <a
                            href="/write-review"
                            className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-700"
                        >
                            Write a review
                        </a>
                    </div>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
                            <div>
                                <div className="flex gap-1 text-yellow-500 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <blockquote className="text-gray-900">
                                    <p>"{review.content}"</p>
                                </blockquote>
                            </div>
                            <div className="mt-6 flex items-center gap-x-4">
                                {review.image ? (
                                    <img className="h-10 w-10 rounded-full bg-white" src={review.image} alt={review.clientName} />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 font-bold">
                                        {review.clientName.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold">{review.clientName}</div>
                                    <div className="text-gray-600 text-sm">{review.position || ''}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
