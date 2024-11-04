"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, UserRoundPlus, CalendarCheck } from "lucide-react"
import { ProjectStatus } from '@/db/index';
import { Role } from "@/db/index"

export default function Sidebar({ params, projects, role }: {
    params: Promise<{ slug: string }>,
    projects: { name: string, description: string, startDate: Date, endDate: Date, status: ProjectStatus, id: number }[], role: Role | null
}) {
    const {slug} = React.use(params);
    const [isOpen, setIsOpen] = useState(true)
    const toggleSidebar = () => setIsOpen(!isOpen)
    const projectName = projects.find((i) => i.id === Number(slug))

    return (
        <div className={`min-h-screen bg-slate-900 px-3 py-2 border-r border-slate-600 ${isOpen ? 'w-64' : 'w-0'} transition duration-600`}>
            {!isOpen && (
                <Button onClick={toggleSidebar} className="bg-slate-800 h-6 w-6 px-1 rounded-full">
                    <ChevronRight className="font-bold text-white" />
                </Button>
            )}
            {isOpen && (
                <div className="w-full flex flex-col gap-6">
                    {/* item 1 */}
                    <div className="w-full flex justify-between items-center border-b border-slate-600 py-2">
                        <div className="text-slate-200 font-semibold">{projectName?.name}</div>
                        <Button onClick={toggleSidebar} className="bg-slate-800 h-6 w-6 px-1 rounded-full">
                            <ChevronLeft className="font-bold text-white" />
                        </Button>
                    </div>
                    {/* item 2 */}
                    <div className="w-full flex flex-col gap-2 items-start py-3">
                        <NavItem href="/board-list" icon={<LayoutDashboard />}>
                            boards
                        </NavItem>
                        <NavItem href={`/board/${Number(slug)}/members`} icon={<Users />}>
                            Members
                        </NavItem>
                        {role === 'MANAGER' ? (
                            <NavItem href={`/board/${Number(slug)}/add`} icon={<UserRoundPlus />}>
                                Add member
                            </NavItem>
                        ) : null}
                        {role === 'MANAGER' ? (
                            <NavItem href={`/board/${Number(slug)}/create-task`} icon={<CalendarCheck />}>
                                Create task
                            </NavItem>
                        ) : null}
                    </div>

                    {/* item 3 */}
                    <div className="w-full flex flex-col gap-2 items-start pb-3">
                        <h3 className="text-slate-300 text-left">
                            Your boards
                        </h3>
                        {projects?.map((item, index) => (
                            <NavItem key={index} href={`/board/${item?.id}`} icon={<LayoutDashboard />}>
                                {item?.name}
                            </NavItem>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function NavItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="w-full flex gap-2 items-center px-4 py-2 text-slate-200 hover:bg-slate-800 rounded-xl"
        >
            {icon}
            {children}
        </Link>
    )
}