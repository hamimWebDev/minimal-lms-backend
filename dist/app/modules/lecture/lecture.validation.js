"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureValidation = void 0;
const zod_1 = require("zod");
const createLecture = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Lecture title is required',
        }).min(1, 'Lecture title cannot be empty').max(200, 'Lecture title cannot exceed 200 characters'),
        moduleId: zod_1.z.string({
            required_error: 'Module ID is required',
        }).min(24, 'Invalid module ID').max(24, 'Invalid module ID'),
        videoUrl: zod_1.z.string().optional(),
        videoFile: zod_1.z.string().optional(),
        pdfNotes: zod_1.z.array(zod_1.z.string()).optional(),
        duration: zod_1.z.coerce.number().min(0, 'Duration cannot be negative').optional(),
        order: zod_1.z.coerce.number({
            required_error: 'Lecture order is required',
        }).min(1, 'Order must be at least 1'),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
const updateLecture = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Lecture title cannot be empty').max(200, 'Lecture title cannot exceed 200 characters').optional(),
        moduleId: zod_1.z.string().min(24, 'Invalid module ID').max(24, 'Invalid module ID').optional(),
        videoUrl: zod_1.z.string().optional(),
        videoFile: zod_1.z.string().optional(),
        pdfNotes: zod_1.z.array(zod_1.z.string()).optional(),
        duration: zod_1.z.coerce.number().min(0, 'Duration cannot be negative').optional(),
        order: zod_1.z.coerce.number().min(1, 'Order must be at least 1').optional(),
        isPublished: zod_1.z.coerce.boolean().optional(),
    }),
});
const reorderLectures = zod_1.z.object({
    body: zod_1.z.object({
        lectureIds: zod_1.z.array(zod_1.z.string().min(24, 'Invalid lecture ID').max(24, 'Invalid lecture ID')).min(1, 'At least one lecture ID is required'),
    }),
});
exports.lectureValidation = {
    createLecture,
    updateLecture,
    reorderLectures,
};
