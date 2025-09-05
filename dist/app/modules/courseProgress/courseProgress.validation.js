"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseProgressValidation = void 0;
const zod_1 = require("zod");
const unlockLectureSchema = zod_1.z.object({
    body: zod_1.z.object({
        lectureId: zod_1.z.string().min(1, 'Lecture ID is required'),
    }),
});
const markLectureCompletedSchema = zod_1.z.object({
    body: zod_1.z.object({
        lectureId: zod_1.z.string().min(1, 'Lecture ID is required'),
    }),
});
const getProgressSchema = zod_1.z.object({
    params: zod_1.z.object({
        courseId: zod_1.z.string().min(1, 'Course ID is required'),
    }),
});
const getAllProgressSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
        courseId: zod_1.z.string().optional(),
        progressPercentage: zod_1.z.string().optional(),
    }),
});
exports.courseProgressValidation = {
    unlockLecture: unlockLectureSchema,
    markLectureCompleted: markLectureCompletedSchema,
    getProgress: getProgressSchema,
    getAllProgress: getAllProgressSchema,
};
