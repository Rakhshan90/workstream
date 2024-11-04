'use server';

import { authOptions } from '../../lib/auth';
import db from '../../db/index';
import { Role } from '../../db/index'; 
import { signUpSchema } from './schema';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';

export const signUp = async (name: string, email: string, password: string, role: Role) => {

    const { success } = signUpSchema.safeParse({
        name,
        email,
        password,
        role,
    });

    if (!success) {
        return {
            message: "Failed to sign up, due to invalid input type"
        }
    }


    try {
        const user = await db.user.findFirst({
            where: { email }
        });

        if (user) {
            return {
                message: "Account is already registered, try to login"
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role,
            }
        });

        return {
            message: 'Account is created, now you can login'
        }

    } catch (error) {
        return {
            message: 'Error while signing up, please try again'
        }
    }
}


export const getEmployees = async (filter: string) => {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user || !session?.user.id) {
        return {
            message: 'You are not authenticated',
            employees: [],
        };
    }

    try {
        const manager = await db.user.findFirst({
            where: { id: Number(session?.user?.id) }
        });

        if (manager?.role !== 'MANAGER') {
            return {
                message: 'You are not allowed to search employees',
                employees: [],
            }
        }

        const employees = await db.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: filter,
                            mode: 'insensitive',
                        }
                    },
                    {
                        email: {
                            contains: filter,
                            mode: 'insensitive',
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return {
            message: 'Employees have been fetched',
            employees: employees || [],
        }

    } catch (error) {
        return {
            message: 'Failed to get employees, try again',
            employees: [],
        }
    }
}


// get project specific employees
export const getProjectEmployees = async (projectId: number) => {

    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user || !session?.user.id) {
        return {
            message: 'You are not authenticated',
            employees: [],
        };
    }

    try {
        
        const project = await db.project.findFirst({
            where: {
                id: projectId
            }
        });

        if(!project){
            return {
                message: 'Project not found',
                employees: [],
            }
        }

        const employees = await db.project.findFirst({
            where: {
                id: projectId,
            },
            select: {
                employees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return {
            message: 'Employees within this project are fetched',
            employees: employees?.employees || [],
        }

    } catch (error) {
        return {
            message: 'Failed to get employees, try again',
            employees: [],
        }   
    }
}

export async function getUserRole(userId: number) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
        });
        return user?.role || null;
    } catch (error) {
        return null;
    }
}
