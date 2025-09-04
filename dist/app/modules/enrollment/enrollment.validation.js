"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentValidation = void 0;
const zod_1 = require("zod");
const createEnrollmentRequest = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.string({
            required_error: 'Course ID is required',
        }).min(24, 'Invalid course ID').max(24, 'Invalid course ID'),
        requestMessage: zod_1.z.string().max(500, 'Request message cannot exceed 500 characters').optional(),
    }),
});
const updateEnrollmentRequest = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
        adminResponse: zod_1.z.string().max(500, 'Admin response cannot exceed 500 characters').optional(),
    }),
});
const getEnrollmentRequests = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
        userId: zod_1.z.string().min(24, 'Invalid user ID').max(24, 'Invalid user ID').optional(),
        courseId: zod_1.z.string().min(24, 'Invalid course ID').max(24, 'Invalid course ID').optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().transform(Number).optional(),
        limit: zod_1.z.string().transform(Number).optional(),
    }),
});
exports.enrollmentValidation = {
    createEnrollmentRequest,
    updateEnrollmentRequest,
    getEnrollmentRequests,
};
