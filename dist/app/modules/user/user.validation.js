"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    role: zod_1.z.enum(["admin", "user"]),
    status: zod_1.z.enum(["in-progress", "blocked"]),
    isDeleted: zod_1.z.boolean(),
});
exports.UserValidation = {
    createUserValidationSchema,
};
