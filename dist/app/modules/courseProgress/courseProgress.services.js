"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressServices = void 0;
const courseProgress_model_1 = __importDefault(require("./courseProgress.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = __importDefault(require("../course/course.model"));
const module_model_1 = __importDefault(require("../module/module.model"));
const lecture_model_1 = __importDefault(require("../lecture/lecture.model"));
const enrollment_model_1 = __importDefault(require("../enrollment/enrollment.model"));
const unlockLecture = async (req) => {
    const { lectureId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Check if lecture exists and get its course
    const lecture = await lecture_model_1.default.findById(lectureId).populate('moduleId');
    if (!lecture) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    const module = await module_model_1.default.findById(lecture.moduleId);
    if (!module) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    const courseId = module.courseId.toString();
    // Check if user is enrolled in the course
    const enrollmentRequest = await enrollment_model_1.default.findOne({
        userId,
        courseId,
        status: 'approved',
    });
    if (!enrollmentRequest) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is not enrolled in this course');
    }
    // Get or create course progress
    let courseProgress = await courseProgress_model_1.default.findOne({ userId, courseId });
    if (!courseProgress) {
        // Create new progress record with first lecture unlocked
        courseProgress = await courseProgress_model_1.default.create({
            userId,
            courseId,
            unlockedLectures: [lectureId],
            completedLectures: [],
            currentLectureId: lectureId,
        });
    }
    else {
        // Check if lecture is already unlocked
        if (courseProgress.unlockedLectures.includes(lectureId)) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, 'Lecture is already unlocked');
        }
        // Get all lectures in the course to determine unlock order
        const modules = await module_model_1.default.find({ courseId });
        const moduleIds = modules.map(module => module._id);
        const allLectures = await lecture_model_1.default.find({
            moduleId: { $in: moduleIds },
            isPublished: true
        }).sort({ createdAt: 1 });
        // Find the index of the lecture to unlock
        const lectureIndex = allLectures.findIndex(lect => lect._id.toString() === lectureId);
        if (lectureIndex === -1) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found in course');
        }
        // Check if previous lectures are completed (for progressive unlocking)
        const previousLectures = allLectures.slice(0, lectureIndex);
        const allPreviousCompleted = previousLectures.every(prevLecture => courseProgress?.completedLectures.includes(prevLecture._id.toString()));
        if (!allPreviousCompleted && lectureIndex > 0) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Complete previous lectures to unlock this lecture');
        }
        // Unlock the lecture
        courseProgress.unlockedLectures.push(lectureId);
        courseProgress.currentLectureId = lectureId;
        await courseProgress.save();
    }
    return courseProgress;
};
const markLectureCompleted = async (req) => {
    const { lectureId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    // Check if lecture exists and get its course
    const lecture = await lecture_model_1.default.findById(lectureId).populate('moduleId');
    if (!lecture) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    const module = await module_model_1.default.findById(lecture.moduleId);
    if (!module) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    const courseId = module.courseId.toString();
    // Get course progress
    const courseProgress = await courseProgress_model_1.default.findOne({ userId, courseId });
    if (!courseProgress) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course progress not found');
    }
    // Check if lecture is unlocked
    if (!courseProgress.unlockedLectures.includes(lectureId)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Lecture is not unlocked');
    }
    // Check if lecture is already completed
    if (courseProgress.completedLectures.includes(lectureId)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Lecture is already completed');
    }
    // Mark lecture as completed
    courseProgress.completedLectures.push(lectureId);
    await courseProgress.save();
    return courseProgress;
};
const getCourseProgress = async (req) => {
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
    // Check if user is enrolled in the course
    const enrollmentRequest = await enrollment_model_1.default.findOne({
        userId,
        courseId,
        status: 'approved',
    });
    if (!enrollmentRequest) {
        // Return default progress if user is not enrolled
        return {
            userId,
            courseId,
            unlockedLectures: [],
            completedLectures: [],
            progressPercentage: 0,
            totalLectures: 0,
        };
    }
    // Get course progress
    let courseProgress = await courseProgress_model_1.default.findOne({ userId, courseId });
    if (!courseProgress) {
        // Return default progress if no progress exists
        return {
            userId,
            courseId,
            unlockedLectures: [],
            completedLectures: [],
            progressPercentage: 0,
            totalLectures: 0,
        };
    }
    // Get total lectures count
    const modules = await module_model_1.default.find({ courseId });
    const moduleIds = modules.map(module => module._id);
    const totalLectures = await lecture_model_1.default.countDocuments({
        moduleId: { $in: moduleIds },
        isPublished: true
    });
    return {
        ...courseProgress.toObject(),
        totalLectures,
    };
};
const getAllCourseProgress = async (req) => {
    const courseProgressQuery = new QueryBuilder_1.default(courseProgress_model_1.default.find().populate('userId', 'name email').populate('courseId', 'title'), req.query)
        .search(['userId', 'courseId'])
        .filter()
        .sort()
        .paginate();
    const result = await courseProgressQuery.modelQuery;
    return result;
};
const getAdminProgressOverview = async (req) => {
    const { courseId } = req.params;
    // Get all progress for a specific course
    const progressData = await courseProgress_model_1.default.find({ courseId })
        .populate('userId', 'name email')
        .populate('courseId', 'title')
        .sort({ progressPercentage: -1 });
    // Calculate statistics
    const totalUsers = progressData.length;
    const averageProgress = totalUsers > 0
        ? Math.round(progressData.reduce((sum, progress) => sum + progress.progressPercentage, 0) / totalUsers)
        : 0;
    const completedUsers = progressData.filter(progress => progress.progressPercentage === 100).length;
    const completionRate = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;
    return {
        courseId,
        totalUsers,
        averageProgress,
        completedUsers,
        completionRate,
        progressData,
    };
};
exports.CourseProgressServices = {
    unlockLecture,
    markLectureCompleted,
    getCourseProgress,
    getAllCourseProgress,
    getAdminProgressOverview,
};
