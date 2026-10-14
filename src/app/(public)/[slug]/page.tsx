import { notFound } from 'next/navigation';
import * as pageRepo from '@/lib/repositories/page.repository';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPageData(slug: string) {
    try {
        return await pageRepo.findPageBySlug(slug);
    } catch (error) {
        return null;
    }
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await getPageData(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="bg-transparent py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        {page.title}
                    </h1>
                    <div className="mt-8 text-lg leading-8 text-gray-600 whitespace-pre-wrap">
                        {page.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
