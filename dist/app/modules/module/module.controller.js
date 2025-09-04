"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleControllers = void 0;
const module_services_1 = require("./module.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const createModule = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await module_services_1.ModuleServices.createModule(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Module created successfully',
        data: result,
    });
});
const getAllModules = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = req.query;
    const result = await module_services_1.ModuleServices.getAllModules(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Modules retrieved successfully',
        data: result.data,
    });
});
const getModulesByCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId } = req.params;
    const result = await module_services_1.ModuleServices.getModulesByCourse(courseId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course modules retrieved successfully',
        data: result,
    });
});
const getModuleById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await module_services_1.ModuleServices.getModuleById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Module retrieved successfully',
        data: result,
    });
});
const updateModule = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await module_services_1.ModuleServices.updateModule(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Module updated successfully',
        data: result,
    });
});
const deleteModule = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await module_services_1.ModuleServices.deleteModule(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Module deleted successfully',
        data: result,
    });
});
const reorderModules = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId } = req.params;
    const { moduleIds } = req.body;
    const result = await module_services_1.ModuleServices.reorderModules(courseId, moduleIds);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Modules reordered successfully',
        data: result,
    });
});
exports.ModuleControllers = {
    createModule,
    getAllModules,
    getModulesByCourse,
    getModuleById,
    updateModule,
    deleteModule,
    reorderModules,
};
