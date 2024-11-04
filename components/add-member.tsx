'use client';

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Search, X } from 'lucide-react'
import { DropdownMenuSeparator } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { getEmployees } from '@/actions/user/index';
import { addEmployeesToProject } from '@/actions/project-board/index';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/db/index';
import { useRouter } from 'next/navigation';

const AddMember = ({ projectId, role }: { projectId: number, role:  Role | null}) => {

    const router = useRouter();
    if(role !== 'MANAGER'){
        router.push(`/board/${projectId}`);
    }

    const [filter, setFilter] = useState('');
    const [users, setUsers] = useState<{ name: string, email: string, id: number }[]>([]);
    const [employeeIds, setEmployeeIds] = useState<{ id: number, name: string }[]>([]);
    const { toast } = useToast();

    const searchEmployees = async () => {
        const res = await getEmployees(filter);
        setUsers(res.employees);
    }

    useEffect(() => {
        searchEmployees();
    }, [filter, employeeIds]);

    const addEmployees = async () => {
        try {
            const newArr: number[] = [];
            employeeIds.forEach((item) => {
                newArr.push(item?.id);
            });
            const res = await addEmployeesToProject(projectId, newArr);
            toast({
                title: 'Response',
                description: res.message,
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add employee to this project board, try again'
            })
        }
    }

    return (
        <div className='w-full flex flex-col gap-2'>
            <div className="w-full relative">
                <div className="flex items-center bg-slate-900 rounded-md">
                    <Input onChange={(e) => { setFilter(e.target.value) }} className='w-full bg-slate-900 text-slate-300 border-none placeholder:text-slate-300'
                        placeholder='Search your employees by name and email...' />
                    <Search className='bg-slate-900 text-slate-300 mr-2' />
                </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-600" />

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    {employeeIds?.map((item, index) => (
                        <div key={index} className="flex gap-4 bg-slate-900 text-slate-300 px-2 py-1 5 rounded-lg">
                            <div className="text-slate-300 text-md">{item?.name}</div>
                            <Button className='hover:bg-red-600 h-6 w-6 px-1 rounded-lg'>
                                <X onClick={() => {
                                    setEmployeeIds(employeeIds.filter((_, i) => i !== index))
                                }} className='text-slate-300 w-8 h-8' />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button onClick={addEmployees} className='bg-blue-600 text-slate-950 w-1/6 hover:bg-slate-800 hover:text-white'>Save</Button>
            </div>

            <DropdownMenuSeparator className="bg-slate-600" />

            {users?.map((user, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <div className="w-full flex justify-between items-center bg-slate-800 rounded-lg p-2">
                        <div className="flex flex-col">
                            <div className="text-md text-slate-300">{user?.name}</div>
                            <div className="text-md text-slate-300">{user?.email}</div>
                        </div>
                        <Button onClick={() => setEmployeeIds([...employeeIds, { id: user?.id, name: user?.name }])} className='bg-blue-600 text-slate-950 hover:bg-slate-700 hover:text-white'>Add</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AddMember