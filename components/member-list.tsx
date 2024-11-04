import React from 'react'
import { Card } from './ui/card'

const MemberList = ({ employees }: { employees: { id: number, name: string, email: string }[] }) => {
    return (
        <div className='w-full grid grid-cols-12 gap-4'>
            {employees?.map((item, index) => (
                <div key={index} className='col-span-12 md:col-span-6'>
                    <Card className='bg-slate-900 border-none p-4 flex flex-col'>
                        <div className="text-slate-300 font-bold text-lg">{item?.name}</div>
                        <div className="text-slate-300">{item?.email}</div>
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default MemberList