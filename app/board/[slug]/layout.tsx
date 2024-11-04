import { authOptions } from '@/lib/auth';
import DashboardAppbar from '@/components/dashboard-appbar'
import Sidebar from '@/components/sidebar'
import { viewEmployeeProjects, viewManagerProjects } from '@/actions/project-board/index';
import { getUserRole } from '@/actions/user/index';
import { getServerSession } from 'next-auth';
import React from 'react'
import { redirect } from 'next/navigation';

export default async function Layout({ children, params }: { children: React.ReactNode, 
    params: Promise<{ slug: string }> }) {

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        redirect('/signin');
    }
    const role = await getUserRole(Number(session?.user?.id));
    let projects;
    if (role === 'MANAGER') {
        projects = await viewManagerProjects();
    }
    else {
        projects = await viewEmployeeProjects();
    }

    return (
        <div className="flex flex-col">
            <DashboardAppbar role={role} />
            <div className='flex'>
                <Sidebar role={role} params={params} projects={projects.projects} />
                {children}
            </div>
        </div>
    )
}