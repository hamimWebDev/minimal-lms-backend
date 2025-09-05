"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressControllers = void 0;
const courseProgress_services_1 = require("./courseProgress.services");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const unlockLecture = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseProgress_services_1.CourseProgressServices.unlockLecture(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Lecture unlocked successfully',
        data: result,
    });
});
const markLectureCompleted = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseProgress_services_1.CourseProgressServices.markLectureCompleted(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Lecture marked as completed',
        data: result,
    });
});
const getCourseProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseProgress_services_1.CourseProgressServices.getCourseProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Course progress retrieved successfully',
        data: result,
    });
});
const getAllCourseProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseProgress_services_1.CourseProgressServices.getAllCourseProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'All course progress retrieved successfully',
        data: result,
    });
});
const getAdminProgressOverview = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseProgress_services_1.CourseProgressServices.getAdminProgressOverview(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin progress overview retrieved successfully',
        data: result,
    });
});
exports.CourseProgressControllers = {
    unlockLecture,
    markLectureCompleted,
    getCourseProgress,
    getAllCourseProgress,
    getAdminProgressOverview,
};
