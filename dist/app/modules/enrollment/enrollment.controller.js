"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentControllers = void 0;
const enrollment_services_1 = require("./enrollment.services");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createEnrollmentRequest = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.createEnrollmentRequest(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Enrollment request created successfully',
        data: result,
    });
});
const getAllEnrollmentRequests = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.getAllEnrollmentRequests(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Enrollment requests retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getEnrollmentRequestsByUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.getEnrollmentRequestsByUser(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'User enrollment requests retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getEnrollmentRequestById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.getEnrollmentRequestById(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Enrollment request retrieved successfully',
        data: result,
    });
});
const updateEnrollmentRequest = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.updateEnrollmentRequest(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Enrollment request updated successfully',
        data: result,
    });
});
const deleteEnrollmentRequest = (0, catchAsync_1.default)(async (req, res) => {
    await enrollment_services_1.EnrollmentServices.deleteEnrollmentRequest(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Enrollment request deleted successfully',
        data: null,
    });
});
const checkUserEnrollmentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await enrollment_services_1.EnrollmentServices.checkUserEnrollmentStatus(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Enrollment status checked successfully',
        data: result,
    });
});
exports.EnrollmentControllers = {
    createEnrollmentRequest,
    getAllEnrollmentRequests,
    getEnrollmentRequestsByUser,
    getEnrollmentRequestById,
    updateEnrollmentRequest,
    deleteEnrollmentRequest,
    checkUserEnrollmentStatus,
};
