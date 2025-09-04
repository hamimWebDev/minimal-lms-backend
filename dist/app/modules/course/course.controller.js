"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const course_services_1 = require("./course.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await course_services_1.CourseServices.createCourse(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Course created successfully',
        data: result,
    });
});
const getAllCourses = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = req.query;
    const result = await course_services_1.CourseServices.getAllCourses(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Courses retrieved successfully',
        data: result.data,
    });
});
const getCourseById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await course_services_1.CourseServices.getCourseById(id, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course retrieved successfully',
        data: result,
    });
});
const updateCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await course_services_1.CourseServices.updateCourse(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    });
});
const deleteCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await course_services_1.CourseServices.deleteCourse(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course deleted successfully',
        data: result,
    });
});
const getPublishedCourses = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = req.query;
    const userId = req.user?.id;
    const result = await course_services_1.CourseServices.getPublishedCourses(filters, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Published courses retrieved successfully',
        data: result.data,
    });
});
const checkCourseAccess = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
        return;
    }
    await course_services_1.CourseServices.checkCourseAccess(id, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access granted',
        data: null,
    });
});
exports.CourseControllers = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getPublishedCourses,
    checkCourseAccess,
};
