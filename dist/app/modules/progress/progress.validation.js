"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressValidation = void 0;
const zod_1 = require("zod");
const unlockLectureSchema = zod_1.z.object({
    lectureId: zod_1.z.string().min(1, 'Lecture ID is required'),
});
const markLectureCompletedSchema = zod_1.z.object({
    lectureId: zod_1.z.string().min(1, 'Lecture ID is required'),
});
const getProgressSchema = zod_1.z.object({
    courseId: zod_1.z.string().min(1, 'Course ID is required'),
});
const getUserProgressSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required').optional(),
});
exports.progressValidation = {
    unlockLecture: unlockLectureSchema,
    markLectureCompleted: markLectureCompletedSchema,
    getProgress: getProgressSchema,
    getUserProgress: getUserProgressSchema,
};
