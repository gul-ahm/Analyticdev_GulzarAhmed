import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import * as projectRepo from '@/lib/repositories/project.repository';
import * as contactRepo from '@/lib/repositories/contact.repository';
import * as pageRepo from '@/lib/repositories/page.repository';

export default async function AdminDashboard() {
    // Server-side authentication check
    const user = await getCurrentUser();

    if (!user) {
        redirect('/admin/login');
    }

    // Fetch real data
    const projectCount = await projectRepo.countProjects();
    const contactCount = await contactRepo.countContactSubmissions();
    const pageCount = await pageRepo.countPages();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{projectCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Contact Submissions</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{contactCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Active Pages</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{pageCount}</p>
                </div>
            </div>
        </div>
    );
}
