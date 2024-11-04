'use server';

import db, { Role } from '../../db/index';
import { projectSchema } from './schema';
import { ProjectStatus } from '../../db/index';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export const createProject = async (name: string, description: string, startDate: Date, endDate: Date, status: ProjectStatus) => {

    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    const { success } = projectSchema.safeParse({
        name,
        description,
        startDate,
        endDate,
        status,
    });

    if (!success) {
        return {
            message: 'Failed to create project due to invalid input types'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: { id: Number(session?.user?.id) }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to create projects, only managers are allowed to create projects'
            }
        }

        await db.project.create({
            data: {
                name,
                description,
                startDate,
                endDate,
                status,
                managerId: Number(session?.user?.id),
            }
        });

        return {
            message: 'Project created successfully, now you can add team members to the project',
        }

    } catch (error) {
        return {
            message: 'Failed to create project, please try again'
        }
    }
}

export const addEmployeesToProject = async (projectId: number, employeeIds: number[]) => {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, please log in again.'
        };
    }

    try {
        const manager = await db.user.findFirst({
            where: { id: Number(session?.user?.id) }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to add employees, only managers can do this.'
            };
        }

        // Ensure that the project exists and is managed by the current user
        const project = await db.project.findFirst({
            where: { id: projectId, managerId: Number(session?.user?.id) }
        });

        if (!project) {
            return {
                message: 'Project not found or you are not authorized to manage this project.'
            };
        }

        // Fetch all employees with the provided IDs
        const validEmployees = await db.user.findMany({
            where: {
                id: { in: employeeIds },
                role: 'EMPLOYEE'
            }
        });

        if (validEmployees.length === 0) {
            return {
                message: 'No valid employees found with the provided IDs.'
            };
        }

        // Connect employees to the project using Prisma's many-to-many relation
        await db.project.update({
            where: { id: projectId },
            data: {
                employees: {
                    connect: validEmployees.map((employee: {
                        id: number;
                        name: string;
                        password: string;
                        email: string;
                        role: Role;
                        createdAt: Date;
                        updatedAt: Date;
                    }) => ({ id: employee.id }))
                }
            }
        });

        return {
            message: 'Employees added successfully to the project.'
        };

    } catch (error) {
        console.error(error);
        return {
            message: 'Failed to add employees to the project. Please try again.'
        };
    }
};




export const viewManagerProjects = async () => {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated and is a manager
    if (!session?.user || !session?.user.id) {
        return {
            message: 'You are not authenticated',
            projects: [],
        };
    }

    try {
        // Check if the user has the role of 'MANAGER'
        const manager = await db.user.findFirst({
            where: { id: Number(session.user.id) },
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'Only managers can view the projects they manage',
                projects: [],
            };
        }

        // Fetch projects where the user is the manager
        const projects = await db.project.findMany({
            where: { managerId: Number(session.user.id) },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
            }
        });

        return {
            message: 'Projects fetched successfully',
            projects: projects || [],
        };
    } catch (error) {
        return {
            message: 'Failed to fetch projects',
            projects: [],
        };
    }
};


export const viewEmployeeProjects = async () => {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user || !session?.user.id) {
        return {
            message: 'You are not authenticated',
            projects: [],
        };
    }

    try {
        // Fetch projects where the employee is part of the project (in the employees array)
        const projects = await db.project.findMany({
            where: {
                employees: {
                    some: {
                        id: Number(session.user.id),
                    },
                },
            },
        });

        return {
            message: 'Projects fetched successfully',
            projects: projects || [],
        };
    } catch (error) {
        return {
            message: 'Failed to fetch projects',
            projects: [],
        };
    }
};