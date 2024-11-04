'use client';

import React from 'react'
import {
    Card,
} from "@/components/ui/card"
import { ProjectStatus } from '@/db/index';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Role } from '@/db/index';

const ProjectCard = ({ projects, role }: { projects: { name: string, description: string, startDate: Date, endDate: Date, status: ProjectStatus, id: number }[], role: Role | null }) => {

    const router = useRouter();

    return (
        <>
            {projects?.map((project, index) => (
                <Card key={index} className='bg-slate-900 border-none p-4'>
                    <div className="w-full flex flex-col gap-4 items-center lg:flex-row lg:justify-between lg:items-start">
                        <div className="w-1/2 flex flex-col gap-4">
                            <div className="flex flex-col gap-4 lg:flex-row">
                                <h2 className="text-left text-xl text-blue-600">{project?.name}</h2>
                                {role === 'MANAGER' ? (
                                    <Button
                                        onClick={() => router.push(`/board/${project?.id}/add`)}
                                        className='bg-blue-600 text-slate-900 hover:bg-slate-800 hover:text-slate-300'>
                                        Add employees
                                    </Button>
                                ) : null}
                                <Button variant='outline'
                                    onClick={() => router.push(`/board/${project?.id}`)}
                                    className='bg-slate-900 border-blue-600 text-blue-600'>
                                    View board
                                </Button>
                            </div>
                            <p className="text-md text-left text-slate-300">
                                {project?.description?.slice(0, 100) + '...'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-1/2 lg:w-auto">
                            <p className="text-md text-left text-slate-300 w-52 md:w-full">{project?.startDate.toDateString()} - {project?.endDate.toDateString()}</p>
                            <p className="text-md text-left text-slate-300">{project?.status}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </>
    )
}

export default ProjectCard