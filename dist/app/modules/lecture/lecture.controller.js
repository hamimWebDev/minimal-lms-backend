"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureControllers = void 0;
const lecture_services_1 = require("./lecture.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createLecture = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await lecture_services_1.LectureServices.createLecture(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Lecture created successfully',
        data: result,
    });
});
const getAllLectures = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = req.query;
    const result = await lecture_services_1.LectureServices.getAllLectures(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Lectures retrieved successfully',
        data: result.data,
    });
});
const getLecturesByModule = (0, catchAsync_1.default)(async (req, res, next) => {
    const { moduleId } = req.params;
    const result = await lecture_services_1.LectureServices.getLecturesByModule(moduleId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Module lectures retrieved successfully',
        data: result,
    });
});
const getLecturesByCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId } = req.params;
    const result = await lecture_services_1.LectureServices.getLecturesByCourse(courseId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course lectures retrieved successfully',
        data: result,
    });
});
const getLectureById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await lecture_services_1.LectureServices.getLectureById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Lecture retrieved successfully',
        data: result,
    });
});
const updateLecture = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await lecture_services_1.LectureServices.updateLecture(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Lecture updated successfully',
        data: result,
    });
});
const deleteLecture = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await lecture_services_1.LectureServices.deleteLecture(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Lecture deleted successfully',
        data: result,
    });
});
const reorderLectures = (0, catchAsync_1.default)(async (req, res, next) => {
    const { moduleId } = req.params;
    const { lectureIds } = req.body;
    const result = await lecture_services_1.LectureServices.reorderLectures(moduleId, lectureIds);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Lectures reordered successfully',
        data: result,
    });
});
exports.LectureControllers = {
    createLecture,
    getAllLectures,
    getLecturesByModule,
    getLecturesByCourse,
    getLectureById,
    updateLecture,
    deleteLecture,
    reorderLectures,
};
