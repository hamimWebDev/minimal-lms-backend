"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidation = void 0;
const zod_1 = require("zod");
const createCourse = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Course title is required',
        }).min(1, 'Course title cannot be empty').max(100, 'Course title cannot exceed 100 characters'),
        price: zod_1.z.coerce.number({
            required_error: 'Course price is required',
        }).min(0, 'Price cannot be negative'),
        description: zod_1.z.string({
            required_error: 'Course description is required',
        }).min(1, 'Course description cannot be empty'),
        thumbnail: zod_1.z.string({
            required_error: 'Course thumbnail is required',
        }),
        instructor: zod_1.z.string().optional(),
        duration: zod_1.z.coerce.number().min(0, 'Duration cannot be negative').optional(),
        level: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        category: zod_1.z.string().optional(),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
const updateCourse = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Course title cannot be empty').max(100, 'Course title cannot exceed 100 characters').optional(),
        price: zod_1.z.coerce.number().min(0, 'Price cannot be negative').optional(),
        description: zod_1.z.string().min(1, 'Course description cannot be empty').optional(),
        thumbnail: zod_1.z.string().optional(),
        instructor: zod_1.z.string().optional(),
        duration: zod_1.z.coerce.number().min(0, 'Duration cannot be negative').optional(),
        level: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        category: zod_1.z.string().optional(),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
exports.courseValidation = {
    createCourse,
    updateCourse,
};
