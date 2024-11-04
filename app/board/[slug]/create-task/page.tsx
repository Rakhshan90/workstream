import { authOptions } from '@/lib/auth';
import CreateTask from '@/components/create-task';
import { getUserRole } from '@/actions/user/index';
import { getServerSession } from 'next-auth';
import React from 'react'


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

    const session = await getServerSession(authOptions);
    const role = await getUserRole(Number(session?.user?.id));
    const slug = (await params).slug;

    return (
        <div className='m-4 flex-1'>
            <CreateTask role={role} id={Number(slug)} />
        </div>
    )
}