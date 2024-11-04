import MultiSelect from '@/components/add-member'
import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserRole } from '@/actions/user/index';


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

    const session = await getServerSession(authOptions);
    const role = await getUserRole(Number(session?.user?.id));
    const slug = (await params).slug;

    return (
        <div className='m-4 flex-1'>
            <MultiSelect role={role} projectId={Number(slug)} />
        </div>
    )
}