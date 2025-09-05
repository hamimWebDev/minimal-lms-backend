"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressControllers = void 0;
const progress_services_1 = require("./progress.services");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createOrUpdateProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.createOrUpdateProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Progress record created/updated successfully',
        data: result,
    });
});
const unlockLecture = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.unlockLecture(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Lecture unlocked successfully',
        data: result,
    });
});
const markLectureCompleted = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.markLectureCompleted(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Lecture marked as completed successfully',
        data: result,
    });
});
const getCourseProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.getCourseProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Course progress retrieved successfully',
        data: result,
    });
});
const getUserProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.getUserProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'User progress retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getAllUsersProgress = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.getAllUsersProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'All users progress retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getProgressStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await progress_services_1.ProgressServices.getProgressStats(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Progress statistics retrieved successfully',
        data: result,
    });
});
const deleteProgress = (0, catchAsync_1.default)(async (req, res) => {
    await progress_services_1.ProgressServices.deleteProgress(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Progress record deleted successfully',
        data: null,
    });
});
exports.ProgressControllers = {
    createOrUpdateProgress,
    unlockLecture,
    markLectureCompleted,
    getCourseProgress,
    getUserProgress,
    getAllUsersProgress,
    getProgressStats,
    deleteProgress,
};
