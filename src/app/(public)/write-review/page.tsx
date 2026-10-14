import ReviewForm from '@/components/public/ReviewForm';

export default function WriteReviewPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Write a Review
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We value your feedback. Please share your experience working with us.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <ReviewForm />
                </div>
            </div>
        </div>
    );
}
