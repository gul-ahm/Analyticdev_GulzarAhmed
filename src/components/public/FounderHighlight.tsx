import Link from 'next/link';
import { Linkedin, Twitter, Github } from 'lucide-react';
import * as teamRepo from '@/lib/repositories/team.repository';

async function getFounder() {
    try {
        // Fetch all team members and find the founder
        const teamMembers = await teamRepo.findAllTeamMembers();
        // Try to find by name containing "Gulzar Ahmed" or slug "founder" or position containing "Founder"
        return teamMembers.find(member =>
            member.name.toLowerCase().includes('gulzar ahmed') ||
            member.slug === 'founder' ||
            member.position.toLowerCase().includes('founder')
        ) || null;
    } catch (error) {
        return null;
    }
}

export default async function FounderHighlight() {
    const founder = await getFounder();

    if (!founder) return null;

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-start">
                        {/* Image Side */}
                        <div className="relative">
                            <div className="aspect-[3/4] w-full rounded-2xl bg-gray-100 object-cover lg:max-w-lg lg:shrink-0 overflow-hidden shadow-2xl">
                                {founder.image ? (
                                    <img
                                        src={founder.image}
                                        alt={founder.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            {/* Decorative blob or element could go here */}
                        </div>

                        {/* Content Side */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the Founder</h2>
                            <div className="mt-6 flex flex-col gap-x-8 gap-y-20">
                                <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                                    <h3 className="text-xl font-semibold leading-8 tracking-tight text-slate-900">{founder.name}</h3>
                                    <p className="text-base leading-7 text-gray-600">{founder.position}</p>

                                    <div className="mt-10 text-lg leading-8 text-gray-600 whitespace-pre-wrap">
                                        {founder.bio}
                                    </div>

                                    {founder.socialLinks && (
                                        <div className="mt-10 flex gap-6">
                                            {founder.socialLinks.linkedin && (
                                                <a href={founder.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slate-900">
                                                    <span className="sr-only">LinkedIn</span>
                                                    <Linkedin size={24} />
                                                </a>
                                            )}
                                            {founder.socialLinks.twitter && (
                                                <a href={founder.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slate-400">
                                                    <span className="sr-only">Twitter</span>
                                                    <Twitter size={24} />
                                                </a>
                                            )}
                                            {founder.socialLinks.github && (
                                                <a href={founder.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                                                    <span className="sr-only">GitHub</span>
                                                    <Github size={24} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
