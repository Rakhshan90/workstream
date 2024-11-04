'use client';

import React from 'react'
import { Button } from './ui/button'
import { Bell } from 'lucide-react'
import { AppbarMenu } from './appbar-menu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Role } from '@/db/index'

const DashboardAppbar = ({ role }: { role: Role | null }) => {

    const router = useRouter();

    return (
        <div className='w-full px-4 py-2 bg-slate-900 border-b border-slate-600'>
            <div className="w-full flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Link href={'/'} className="text-slate-400 font-bold text-xl">
                        Workstream
                    </Link>
                    {role === 'MANAGER' ? (
                        <Button onClick={() => router.push('/create-project-board')} className='bg-blue-600 text-slate-900 
                    hover:text-slate-200 hover:bg-slate-800'>
                            Create
                        </Button>
                    ) : null}
                </div>

                <div className="flex gap-4 items-center">
                    <Bell className='text-slate-200 w-5' />
                    <AppbarMenu />
                </div>
            </div>
        </div>
    )
}

export default DashboardAppbar