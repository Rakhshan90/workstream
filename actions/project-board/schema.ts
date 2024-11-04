import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
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
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"], {
        required_error: "Please provide a valid status",
    }),
});


export type ProjectSchemaType = z.infer<typeof projectSchema>;
