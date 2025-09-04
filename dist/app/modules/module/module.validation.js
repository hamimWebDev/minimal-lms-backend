"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidation = void 0;
const zod_1 = require("zod");
const createModule = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Module title is required',
        }).min(1, 'Module title cannot be empty').max(100, 'Module title cannot exceed 100 characters'),
        moduleNumber: zod_1.z.coerce.number({
            required_error: 'Module number is required',
        }).min(1, 'Module number must be at least 1'),
        courseId: zod_1.z.string({
            required_error: 'Course ID is required',
        }).min(24, 'Invalid course ID').max(24, 'Invalid course ID'),
        description: zod_1.z.string().optional(),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
const updateModule = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Module title cannot be empty').max(100, 'Module title cannot exceed 100 characters').optional(),
        moduleNumber: zod_1.z.coerce.number().min(1, 'Module number must be at least 1').optional(),
        courseId: zod_1.z.string().min(24, 'Invalid course ID').max(24, 'Invalid course ID').optional(),
        description: zod_1.z.string().optional(),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
const reorderModules = zod_1.z.object({
    body: zod_1.z.object({
        moduleIds: zod_1.z.array(zod_1.z.string().min(24, 'Invalid module ID').max(24, 'Invalid module ID')).min(1, 'At least one module ID is required'),
    }),
});
exports.moduleValidation = {
    createModule,
    updateModule,
    reorderModules,
};
