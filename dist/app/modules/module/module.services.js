"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleServices = void 0;
const module_model_1 = __importDefault(require("./module.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createModule = async (payload) => {
    const result = await module_model_1.default.create(payload);
    return result;
};
const getAllModules = async (filters) => {
    const moduleQuery = new QueryBuilder_1.default(module_model_1.default.find(), filters)
        .search(['title'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await moduleQuery.modelQuery;
    const meta = await moduleQuery.countTotal();
    return {
        meta,
        data: result,
    };
};
const getModulesByCourse = async (courseId) => {
    const result = await module_model_1.default.find({ courseId })
        .sort({ moduleNumber: 1 })
        .populate('lecturesCount')
        .populate('totalDuration');
    return result;
};
const getModuleById = async (id) => {
    const result = await module_model_1.default.findById(id)
        .populate('lecturesCount')
        .populate('totalDuration');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return result;
};
const updateModule = async (id, payload) => {
    const result = await module_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return result;
};
const deleteModule = async (id) => {
    const result = await module_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return result;
};
const reorderModules = async (courseId, moduleIds) => {
    const updatePromises = moduleIds.map((moduleId, index) => module_model_1.default.findByIdAndUpdate(moduleId, { moduleNumber: index + 1 }));
    await Promise.all(updatePromises);
    return await getModulesByCourse(courseId);
};
exports.ModuleServices = {
    createModule,
    getAllModules,
    getModulesByCourse,
    getModuleById,
    updateModule,
    deleteModule,
    reorderModules,
};
