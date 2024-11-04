import { getProjectEmployees } from '@/actions/user/index'
import MemberList from '@/components/member-list'
import React from 'react'

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const slug = (await params).slug;
    const employees = await getProjectEmployees(Number(slug));

    return (
        <div className='m-4 flex-1'>
            <MemberList employees={employees.employees} />
        </div>
    )
}

export default page