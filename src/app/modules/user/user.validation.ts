
import { z } from "zod";

const createUserValidationSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    role: z.enum(["admin", "user"]),
    status: z.enum(["in-progress", "blocked"]),
    isDeleted: z.boolean(),
});



export const UserValidation = {
    createUserValidationSchema,
};


