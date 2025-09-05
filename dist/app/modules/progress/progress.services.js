"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressServices = void 0;
const progress_model_1 = __importDefault(require("./progress.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = __importDefault(require("../course/course.model"));
const lecture_model_1 = __importDefault(require("../lecture/lecture.model"));
const module_model_1 = __importDefault(require("../module/module.model"));
const user_model_1 = require("../user/user.model");
const createOrUpdateProgress = async (req) => {
    const { courseId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Check if course exists
    const course = await course_model_1.default.findById(courseId);
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    // Check if user exists
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check if progress already exists
    let progress = await progress_model_1.default.findOne({ userId, courseId });
    if (!progress) {
        // Create new progress record
        progress = await progress_model_1.default.create({
            userId,
            courseId,
            unlockedLectures: [],
            completedLectures: [],
            progressPercentage: 0,
            lastAccessedAt: new Date(),
        });
    }
    return progress;
};
const unlockLecture = async (req) => {
    const { courseId, lectureId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Check if lecture exists
    const lecture = await lecture_model_1.default.findById(lectureId);
    if (!lecture) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    // Check if lecture belongs to the course
    const module = await module_model_1.default.findById(lecture.moduleId);
    if (!module || module.courseId.toString() !== courseId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Lecture does not belong to this course');
    }
    // Get or create progress record
    let progress = await progress_model_1.default.findOne({ userId, courseId });
    if (!progress) {
        progress = await progress_model_1.default.create({
            userId,
            courseId,
            unlockedLectures: [],
            completedLectures: [],
            progressPercentage: 0,
            lastAccessedAt: new Date(),
        });
    }
    // Check if lecture is already unlocked
    if (progress.unlockedLectures.includes(lecture._id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Lecture is already unlocked');
    }
    // Get all modules for this course
    const modules = await module_model_1.default.find({ courseId });
    const moduleIds = modules.map(module => module._id);
    // Get all lectures in the course, sorted by module and order
    const allLectures = await lecture_model_1.default.find({
        moduleId: { $in: moduleIds }
    }).populate('moduleId', 'moduleNumber').sort({ 'moduleId.moduleNumber': 1, order: 1 });
    // Find the current lecture index
    const currentLectureIndex = allLectures.findIndex(l => l._id.toString() === lectureId);
    if (currentLectureIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found in course');
    }
    // Check if previous lectures are unlocked (sequential unlocking)
    if (currentLectureIndex > 0) {
        const previousLecture = allLectures[currentLectureIndex - 1];
        if (!progress.unlockedLectures.includes(previousLecture._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You must complete the previous lecture before unlocking this one');
        }
    }
    // Unlock the lecture
    progress.unlockedLectures.push(lecture._id);
    progress.currentLectureId = lecture._id;
    progress.lastAccessedAt = new Date();
    await progress.save();
    return progress;
};
const markLectureCompleted = async (req) => {
    const { courseId, lectureId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Check if lecture exists
    const lecture = await lecture_model_1.default.findById(lectureId);
    if (!lecture) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    // Get progress record
    const progress = await progress_model_1.default.findOne({ userId, courseId });
    if (!progress) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Progress record not found');
    }
    // Check if lecture is unlocked
    if (!progress.unlockedLectures.includes(lecture._id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Lecture must be unlocked before marking as completed');
    }
    // Check if lecture is already completed
    if (progress.completedLectures.includes(lecture._id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Lecture is already completed');
    }
    // Mark lecture as completed
    progress.completedLectures.push(lecture._id);
    progress.lastAccessedAt = new Date();
    await progress.save();
    return progress;
};
const getCourseProgress = async (req) => {
    const { courseId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const progress = await progress_model_1.default.findOne({ userId, courseId })
        .populate('unlockedLectures', 'title order duration')
        .populate('completedLectures', 'title order duration')
        .populate('currentLectureId', 'title order duration')
        .populate('course', 'title thumbnail');
    if (!progress) {
        // Return empty progress if none exists
        return {
            userId,
            courseId,
            unlockedLectures: [],
            completedLectures: [],
            currentLectureId: null,
            progressPercentage: 0,
            lastAccessedAt: new Date(),
            course: await course_model_1.default.findById(courseId).select('title thumbnail'),
        };
    }
    return progress;
};
const getUserProgress = async (req) => {
    const userId = req.user?.id;
    const requestedUserId = req.params.userId;
    // Check if user is requesting their own progress or is admin
    if (requestedUserId && requestedUserId !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superAdmin') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to view this user\'s progress');
    }
    const targetUserId = requestedUserId || userId;
    if (!targetUserId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const queryBuilder = new QueryBuilder_1.default(progress_model_1.default.find({ userId: targetUserId }), req.query);
    const result = await queryBuilder
        .search(['courseId'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = await queryBuilder.countTotal();
    const progressRecords = await result.modelQuery
        .populate('course', 'title thumbnail instructor')
        .populate('unlockedLectures', 'title order duration')
        .populate('completedLectures', 'title order duration')
        .populate('currentLectureId', 'title order duration');
    return {
        meta,
        data: progressRecords,
    };
};
const getAllUsersProgress = async (req) => {
    const userRole = req.user?.role;
    if (userRole !== 'admin' && userRole !== 'superAdmin') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only admins can view all users progress');
    }
    const queryBuilder = new QueryBuilder_1.default(progress_model_1.default.find(), req.query);
    const result = await queryBuilder
        .search(['userId', 'courseId'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = await queryBuilder.countTotal();
    const progressRecords = await result.modelQuery
        .populate('user', 'name email')
        .populate('course', 'title thumbnail instructor')
        .populate('unlockedLectures', 'title order duration')
        .populate('completedLectures', 'title order duration')
        .populate('currentLectureId', 'title order duration');
    return {
        meta,
        data: progressRecords,
    };
};
const getProgressStats = async (req) => {
    const userId = req.user?.id;
    const requestedUserId = req.params.userId;
    // Check if user is requesting their own stats or is admin
    if (requestedUserId && requestedUserId !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superAdmin') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to view this user\'s stats');
    }
    const targetUserId = requestedUserId || userId;
    if (!targetUserId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Get user's progress records
    const progressRecords = await progress_model_1.default.find({ userId: targetUserId })
        .populate('course', 'title')
        .populate('unlockedLectures', 'title')
        .populate('completedLectures', 'title');
    // Calculate stats
    const totalCourses = progressRecords.length;
    const completedCourses = progressRecords.filter(p => p.progressPercentage === 100).length;
    const inProgressCourses = progressRecords.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length;
    const totalLectures = progressRecords.reduce((sum, p) => sum + p.unlockedLectures.length, 0);
    const completedLectures = progressRecords.reduce((sum, p) => sum + p.completedLectures.length, 0);
    const averageProgress = totalCourses > 0
        ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / totalCourses)
        : 0;
    const stats = {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalLectures,
        completedLectures,
        averageProgress,
    };
    return stats;
};
const deleteProgress = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const progress = await progress_model_1.default.findById(id);
    if (!progress) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Progress record not found');
    }
    // Check if user owns the progress or is admin
    if (progress.userId !== userId && userRole !== 'admin' && userRole !== 'superAdmin') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to delete this progress record');
    }
    await progress_model_1.default.findByIdAndDelete(id);
    return null;
};
exports.ProgressServices = {
    createOrUpdateProgress,
    unlockLecture,
    markLectureCompleted,
    getCourseProgress,
    getUserProgress,
    getAllUsersProgress,
    getProgressStats,
    deleteProgress,
};
