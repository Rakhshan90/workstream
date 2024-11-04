import ProjectCard from '@/components/project-card'
import React from 'react'
import AppBar from '@/components/appbar';
import { viewEmployeeProjects, viewManagerProjects } from '@/actions/project-board';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserRole } from '@/actions/user/index';
import { redirect } from 'next/navigation';


const page = async () => {

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
        <div>
            <AppBar role={role} />
            <div className='m-4 flex flex-col gap-4 flex-1'>
                <ProjectCard role={role} projects={projects.projects} />
            </div>
        </div>
    )
}

export default page