'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Star } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    client: string;
    featured: boolean;
    updatedAt: string;
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <Link
                    href="/admin/projects/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
                >
                    + New Project
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Featured
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {project.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.client || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {project.featured ? (
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        className="text-slate-900 hover:text-slate-900 mr-4 inline-block"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="text-red-600 hover:text-red-900 inline-block"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No projects found.</div>
                )}
            </div>
        </div>
    );
}
