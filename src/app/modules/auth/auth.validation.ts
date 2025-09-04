import { z } from "zod";

 const loginUserValidation = z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }).min(6),
}); 



export const AuthValidation = {
    loginUserValidation,
    
}
