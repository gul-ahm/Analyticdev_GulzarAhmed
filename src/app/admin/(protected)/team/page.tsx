'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    position: string;
    displayOrder: number;
}

export default function AdminTeam() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team');
            const data = await res.json();
            if (data.success) {
                setTeam(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch team', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (id: number) => {
        if (!confirm('Are you sure you want to delete this member?')) return;

        try {
            const res = await fetch(`/api/team/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setTeam(team.filter((m) => m.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete member', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                <Link
                    href="/admin/team/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
                >
                    + Add Member
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {team.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {member.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {member.position}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {member.displayOrder || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/team/${member.id}`}
                                        className="text-slate-900 hover:text-slate-900 mr-4 inline-block"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteMember(member.id)}
                                        className="text-red-600 hover:text-red-900 inline-block"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {team.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No team members found.</div>
                )}
            </div>
        </div>
    );
}
