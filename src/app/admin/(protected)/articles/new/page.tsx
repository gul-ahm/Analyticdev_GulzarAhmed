import ArticleForm, { EMPTY_ARTICLE } from '../ArticleForm';

export default function NewArticlePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Write an article</h1>
            <p className="text-sm text-gray-600 mb-8">
                Saved as a draft stays private. Publishing puts it on the site, in the sitemap and
                in the feed, and adds the Blog link to the public menu.
            </p>
            <ArticleForm initial={EMPTY_ARTICLE} />
        </div>
    );
}
