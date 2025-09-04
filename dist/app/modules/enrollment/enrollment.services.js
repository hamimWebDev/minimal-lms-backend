"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentServices = void 0;
const enrollment_model_1 = __importDefault(require("./enrollment.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = __importDefault(require("../course/course.model"));
const user_model_1 = require("../user/user.model");
const createEnrollmentRequest = async (req) => {
    const { courseId, requestMessage } = req.body;
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
    // Check if enrollment request already exists
    const existingRequest = await enrollment_model_1.default.findOne({
        userId,
        courseId,
    });
    if (existingRequest) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Enrollment request already exists for this course');
    }
    const enrollmentRequest = await enrollment_model_1.default.create({
        userId,
        courseId,
        requestMessage,
    });
    return enrollmentRequest;
};
const getAllEnrollmentRequests = async (req) => {
    const queryBuilder = new QueryBuilder_1.default(enrollment_model_1.default.find(), req.query)
        .search(['requestMessage', 'adminResponse'])
        .filter()
        .paginate()
        .sort();
    const result = await queryBuilder.modelQuery.populate([
        {
            path: 'userId',
            select: 'name email',
        },
        {
            path: 'courseId',
            select: 'title thumbnail',
        },
        {
            path: 'approvedBy',
            select: 'name email',
        },
    ]);
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: result,
    };
};
const getEnrollmentRequestsByUser = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const queryBuilder = new QueryBuilder_1.default(enrollment_model_1.default.find(), { ...req.query, userId })
        .filter()
        .paginate()
        .sort();
    const result = await queryBuilder.modelQuery.populate([
        {
            path: 'courseId',
            select: 'title thumbnail description instructor',
        },
        {
            path: 'approvedBy',
            select: 'name email',
        },
    ]);
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: result,
    };
};
const getEnrollmentRequestById = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const enrollmentRequest = await enrollment_model_1.default.findById(id).populate([
        {
            path: 'userId',
            select: 'name email',
        },
        {
            path: 'courseId',
            select: 'title thumbnail description instructor',
        },
        {
            path: 'approvedBy',
            select: 'name email',
        },
    ]);
    if (!enrollmentRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Enrollment request not found');
    }
    // Check if user is authorized to view this request
    const userRole = req.user?.role;
    if (userRole !== 'admin' && userRole !== 'superAdmin' && enrollmentRequest.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to view this request');
    }
    return enrollmentRequest;
};
const updateEnrollmentRequest = async (req) => {
    const { id } = req.params;
    const { status, adminResponse } = req.body;
    const adminId = req.user?.id;
    const userRole = req.user?.role;
    if (!adminId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    if (userRole !== 'admin' && userRole !== 'superAdmin') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only admins can update enrollment requests');
    }
    const enrollmentRequest = await enrollment_model_1.default.findById(id);
    if (!enrollmentRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Enrollment request not found');
    }
    if (enrollmentRequest.status !== 'pending') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot update a request that is not pending');
    }
    const updateData = {
        status,
        adminResponse,
    };
    if (status === 'approved' || status === 'rejected') {
        updateData.approvedBy = adminId;
        updateData.approvedAt = new Date();
    }
    const updatedRequest = await enrollment_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).populate([
        {
            path: 'userId',
            select: 'name email',
        },
        {
            path: 'courseId',
            select: 'title thumbnail',
        },
        {
            path: 'approvedBy',
            select: 'name email',
        },
    ]);
    return updatedRequest;
};
const deleteEnrollmentRequest = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const enrollmentRequest = await enrollment_model_1.default.findById(id);
    if (!enrollmentRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Enrollment request not found');
    }
    // Only allow deletion if user is admin or if it's their own pending request
    if (userRole !== 'admin' && userRole !== 'superAdmin') {
        if (enrollmentRequest.userId.toString() !== userId) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to delete this request');
        }
        if (enrollmentRequest.status !== 'pending') {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete a request that is not pending');
        }
    }
    await enrollment_model_1.default.findByIdAndDelete(id);
    return null;
};
const checkUserEnrollmentStatus = async (req) => {
    const { courseId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const enrollmentRequest = await enrollment_model_1.default.findOne({
        userId,
        courseId,
    });
    return {
        hasRequest: !!enrollmentRequest,
        status: enrollmentRequest?.status || null,
        request: enrollmentRequest,
    };
};
exports.EnrollmentServices = {
    createEnrollmentRequest,
    getAllEnrollmentRequests,
    getEnrollmentRequestsByUser,
    getEnrollmentRequestById,
    updateEnrollmentRequest,
    deleteEnrollmentRequest,
    checkUserEnrollmentStatus,
};
