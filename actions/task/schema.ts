import { z } from 'zod';


export const taskSchema = z.object({
    projectId: z.number({
        message: "Project ID must be in digit",
    }),
    employeeId: z.number({
        message: "Employee ID must be in digit",
    }),
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    description: z.string().min(5, {
        message: "Description must be at least 5 characters",
    }),
    startDate: z.date({
        message: "Start date of the project is required",
    }),
    endDate: z.date({
        message: "End date of the project is required",
    }),
    status: z.enum(['PENDING', 'ONGOING', 'COMPLETED'], {
        required_error: "Please provide a valid status",
    }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
        required_error: "Please provide a valid priority",
    }),
});

export type taskSchemaType = z.infer<typeof taskSchema>;