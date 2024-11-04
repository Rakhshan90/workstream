'use client';

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Ellipsis } from 'lucide-react'
import { useToast } from '@/hooks/use-toast';
import { updateTaskStatus } from '@/actions/task/index';
import { TaskStatus } from '@/db/index';
import { Role } from '@/db/index';

const TaskDetails = ({ title, description, status, startDate, endDate, priority, employee, role, taskId }: {
    title: string, description: string, status: string, startDate: string, endDate: string,
    priority: string, employee: { id: number, name: string, email: string }, role: Role | null, taskId: number
}) => {
    
    const [statusVal, setStatusVal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const clickHandler = async()=>{
        try {
            setIsLoading(true);
            const res = await updateTaskStatus(taskId, statusVal as TaskStatus);
            setIsLoading(false);
            toast({
                title: 'Response',
                description: res.message,
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update task status, try again',
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-slate-900 h-6 w-6 px-1 rounded-lg'>
                    <Ellipsis className='text-slate-300 w-8 h-8' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-none text-slate-300">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                    <DialogDescription>
                        Time line: {startDate} - {endDate}
                    </DialogDescription>
                    <DialogDescription>
                        Status: {status}
                    </DialogDescription>
                    <DialogDescription>
                        Priority: {priority}
                    </DialogDescription>
                    <DialogDescription>
                        Assigned to: {employee?.name} - {employee?.email}
                    </DialogDescription>
                </DialogHeader>
                {role !== 'MANAGER' ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Mark task
                            </Label>
                            <Select onValueChange={(value)=> setStatusVal(value)}>
                                <SelectTrigger className="w-[180px] border-none bg-slate-800">
                                    <SelectValue placeholder="pending" />
                                </SelectTrigger>
                                <SelectContent className='bg-slate-900 text-slate-300'>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ONGOING">On-going</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : null}
                {role !== 'MANAGER' ? (
                    <DialogFooter>
                        <Button onClick={clickHandler} type="submit" disabled={isLoading}
                        className='bg-blue-600 hover:bg-slate-800'>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export default TaskDetails