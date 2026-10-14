'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, FileText } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    location: string;
    type: string;
    isOpen: boolean;
}

interface Application {
    _id: string;
    job: { title: string };
    name: string;
    email: string;
    resume?: string;
    createdAt: string;
}

export default function AdminCareers() {
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'jobs') {
                const res = await fetch('/api/jobs');
                const data = await res.json();
                if (data.success) setJobs(data.data);
            } else {
                const res = await fetch('/api/applications');
                const data = await res.json();
                if (data.success) setApplications(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) setJobs(jobs.filter((j) => j.id !== id));
        } catch (error) {
            console.error('Failed to delete job', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
                {activeTab === 'jobs' && (
                    <Link
                        href="/admin/careers/new"
                        className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
                    >
                        + New Job
                    </Link>
                )}
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`${activeTab === 'jobs'
                            ? 'border-slate-700 text-slate-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Job Postings
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`${activeTab === 'applications'
                            ? 'border-slate-700 text-slate-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Applications
                    </button>
                </nav>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : activeTab === 'jobs' ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {job.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/careers/${job.id}`} className="text-slate-900 hover:text-slate-900 mr-4 inline-block">
                                            <Edit size={18} />
                                        </Link>
                                        <button onClick={() => deleteJob(job.id)} className="text-red-600 hover:text-red-900 inline-block">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {jobs.length === 0 && <div className="p-8 text-center text-gray-500">No jobs found.</div>}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div>{app.name}</div>
                                        <div className="text-gray-500 font-normal">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.job?.title || 'Unknown Job'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {app.resume ? (
                                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-slate-900 inline-flex items-center">
                                                <FileText size={18} className="mr-1" /> View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No resume</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {applications.length === 0 && <div className="p-8 text-center text-gray-500">No applications received yet.</div>}
                </div>
            )}
        </div>
    );
}
