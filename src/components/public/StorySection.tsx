import * as pageRepo from '@/lib/repositories/page.repository';

interface StorySectionProps {
    slug: string;
}

async function getStory(slug: string) {
    try {
        return await pageRepo.findPageBySlug(slug);
    } catch (error) {
        return null;
    }
}

export default async function StorySection({ slug }: StorySectionProps) {
    const story = await getStory(slug);

    if (!story) return null;

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {story.title}
                    </h2>
                    <div className="mt-6 text-lg leading-8 text-gray-600 whitespace-pre-wrap">
                        {story.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
