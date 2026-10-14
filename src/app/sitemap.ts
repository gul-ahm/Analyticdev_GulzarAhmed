import { MetadataRoute } from 'next';
import * as projectRepo from '@/lib/repositories/project.repository';
import * as jobRepo from '@/lib/repositories/job.repository';
import * as articleRepo from '@/lib/repositories/article.repository';

const BASE_URL = 'https://analyticsdev.xyz'; // Replace with actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let projects: any[] = [];
    let jobs: any[] = [];
    let articles: any[] = [];

    try {
        // Fetch data using MySQL repositories
        projects = await projectRepo.findAllProjects();
        jobs = await jobRepo.findAllJobs(true); // published only
        articles = await articleRepo.findPublishedArticles();
    } catch (error) {
        console.warn('Failed to fetch data for sitemap:', error);
    }

    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: '/small-business-websites', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/services', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/reviews', priority: 0.7, changeFrequency: 'weekly' as const },
        { path: '/team', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/careers', priority: 0.6, changeFrequency: 'weekly' as const },
        { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
        { path: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
    ].map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    const projectRoutes = projects.map((project) => ({
        url: `${BASE_URL}/projects/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const jobRoutes = jobs.map((job) => ({
        url: `${BASE_URL}/careers/${job.id}`,
        lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    const articleRoutes = articles.map((article) => ({
        url: `${BASE_URL}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes, ...jobRoutes, ...articleRoutes];
}
