'use server';

import db from '../../db/index';
import { taskSchema } from './schema';
import { TaskStatus, TaskPriority } from '../../db/index';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export const createTask = async (projectId: number, employeeId: number, title: string, description: string,
    startDate: Date, endDate: Date, status: TaskStatus, priority: TaskPriority
) => {

    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    const { success } = taskSchema.safeParse({
        projectId,
        employeeId,
        title,
        description,
        startDate,
        endDate,
        status,
        priority
    });

    if (!success) {
        return {
            message: 'Failed to create task due to invalid input types'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to create a task, only manager can do this'
            }
        }

        const project = await db.project.findFirst({
            where: { id: projectId }
        });

        if (!project) {
            return {
                message: 'The project does not exist.'
            };
        }

        const existingTask = await db.task.findFirst({
            where: {
                title,
                projectId,
            }
        });

        if (existingTask) {
            return {
                message: 'A task with this title already exists for this project.'
            };
        }

        if (endDate < startDate) {
            return {
                message: 'The end date cannot be earlier than the start date.'
            };
        }

        const employee = await db.user.findFirst({ where: { id: employeeId, role: 'EMPLOYEE' } });
        if (!employee) {
            return { message: 'Invalid employee assignment.' };
        }

        await db.task.create({
            data: {
                title,
                description,
                projectId,
                startDate,
                endDate,
                status,
                priority,
                employeeId,
            }
        });

        return {
            message: 'Task created successfully',
        }

    } catch (error) {
        return {
            message: 'Failed to create task, try again'
        }
    }

}

export const updateTaskStatus = async (taskId: number, status: TaskStatus) => {

    const session = await getServerSession(authOptions);
    if (!session.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {
        const employee = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (employee?.role !== 'EMPLOYEE') {
            return {
                message: 'You are not allowed to update the status of the task'
            }
        }

        const task = await db.task.findFirst({
            where: { id: taskId }
        });

        if (task?.employeeId !== Number(session?.user?.id)) {
            return {
                message: 'You are not allowed to update the status of the task'
            }
        }

        if (status === 'COMPLETED' && task.status !== 'ONGOING') {
            return {
                message: 'You must first mark the task as Ongoing before marking it as Completed.'
            };
        }

        await db.task.update({
            where: { id: taskId },
            data: {
                status,
            }
        });

        return {
            message: 'Task status updated successfully'
        }

    } catch (error) {
        return {
            message: 'Failed to update task status, try again'
        }
    }

}

// get all the assigned pending tasks for employee within project
export const getAssignedPendingProjectTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {

        const employee = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (employee?.role !== 'EMPLOYEE') {
            return {
                message: 'You are not allowed to get the tasks',
                assignedTasks: []
            }
        }

        const project = await db.project.findFirst({
            where: { id: projectId }
        });

        if (!project) {
            return {
                message: 'The project does not exist.',
                assignedTasks: []
            };
        }

        const assignedTasks = await db.task.findMany({
            where: {
                projectId,
                employeeId: Number(session?.user?.id),
                status: 'PENDING',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the project specific assigned tasks have been fetched',
            assignedTasks: assignedTasks || [],
        }

    } catch (error) {
        return {
            message: 'Failed to get assigned tasks',
            assignedTasks: [],
        }
    }
}
// get all the assigned ongoing tasks for employee within project
export const getAssignedOngoingProjectTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {

        const employee = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (employee?.role !== 'EMPLOYEE') {
            return {
                message: 'You are not allowed to get the tasks',
                assignedTasks: []
            }
        }

        const project = await db.project.findFirst({
            where: { id: projectId }
        });

        if (!project) {
            return {
                message: 'The project does not exist.',
                assignedTasks: []
            };
        }

        const assignedTasks = await db.task.findMany({
            where: {
                projectId,
                employeeId: Number(session?.user?.id),
                status: 'ONGOING',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the project specific assigned tasks have been fetched',
            assignedTasks: assignedTasks || [],
        }

    } catch (error) {
        return {
            message: 'Failed to get assigned tasks',
            assignedTasks: [],
        }
    }
}

// get all the assigned completed tasks for employee within project
export const getAssignedCompletedProjectTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {

        const employee = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (employee?.role !== 'EMPLOYEE') {
            return {
                message: 'You are not allowed to get the tasks',
                assignedTasks: []
            }
        }

        const project = await db.project.findFirst({
            where: { id: projectId }
        });

        if (!project) {
            return {
                message: 'The project does not exist.',
                assignedTasks: []
            };
        }

        const assignedTasks = await db.task.findMany({
            where: {
                projectId,
                employeeId: Number(session?.user?.id),
                status: 'COMPLETED',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the project specific assigned tasks have been fetched',
            assignedTasks: assignedTasks || [],
        }

    } catch (error) {
        return {
            message: 'Failed to get assigned tasks',
            assignedTasks: [],
        }
    }
}

export const getOverDueTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: { id: Number(session?.user?.id) },
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to get overdue tasks'
            }
        }

        const project = await db.project.findFirst({
            where: { id: projectId }
        });

        if (!project) {
            return {
                message: 'The project does not exist.'
            };
        }

        const overdueTasks = await db.task.findMany({
            where: {
                projectId,
                endDate: {
                    lt: new Date(),
                },
                status: {
                    in: ['ONGOING', 'PENDING'],
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All overdue tasks have been fetched successfully',
            overdueTasks: overdueTasks || [],
        };

    } catch (error) {
        return {
            message: 'Failed to get tasks',
            getOverDueTasks: []
        }
    }
}

// get all project specific pending tasks
export const getProjectPendingTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: {
                id: Number(session?.user?.id)
            }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to get all the task for this project',
                tasks: [],
            }
        }

        const tasks = await db.task.findMany({
            where: {
                projectId: projectId,
                status: 'PENDING',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the Task have been retrieved for this project',
            tasks: tasks || [],
        }


    } catch (error) {
        return {
            message: 'Failed to retrieve project tasks, try again',
            tasks: [],
        }
    }
}

// get all project specific ongoing tasks
export const getProjectOngoingTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: {
                id: Number(session?.user?.id)
            }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to get all the task for this project',
                tasks: [],
            }
        }

        const tasks = await db.task.findMany({
            where: {
                projectId: projectId,
                status: 'ONGOING',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the Task have been retrieved for this project',
            tasks: tasks || [],
        }


    } catch (error) {
        return {
            message: 'Failed to retrieve project tasks, try again',
            tasks: [],
        }
    }
}
// get all project specific completed tasks
export const getProjectCompletedTasks = async (projectId: number) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            message: 'You are not authenticated, try to login again'
        }
    }

    try {
        const manager = await db.user.findFirst({
            where: {
                id: Number(session?.user?.id)
            }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to get all the task for this project',
                tasks: [],
            }
        }

        const tasks = await db.task.findMany({
            where: {
                projectId: projectId,
                status: 'COMPLETED',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                startDate: true,
                endDate: true,
                priority: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'All the Task have been retrieved for this project',
            tasks: tasks || [],
        }


    } catch (error) {
        return {
            message: 'Failed to retrieve project tasks, try again',
            tasks: [],
        }
    }
}