"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureServices = void 0;
const lecture_model_1 = __importDefault(require("./lecture.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const createLecture = async (payload) => {
    const result = await lecture_model_1.default.create(payload);
    return result;
};
const getAllLectures = async (filters) => {
    const lectureQuery = new QueryBuilder_1.default(lecture_model_1.default.find(), filters)
        .search(['title'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await lectureQuery.modelQuery;
    const meta = await lectureQuery.countTotal();
    return {
        meta,
        data: result,
    };
};
const getLecturesByModule = async (moduleId) => {
    const result = await lecture_model_1.default.find({ moduleId })
        .sort({ order: 1 })
        .populate('courseId');
    return result;
};
const getLecturesByCourse = async (courseId) => {
    const result = await lecture_model_1.default.aggregate([
        {
            $lookup: {
                from: 'modules',
                localField: 'moduleId',
                foreignField: '_id',
                as: 'module',
            },
        },
        {
            $match: {
                'module.courseId': new mongoose_1.default.Types.ObjectId(courseId),
            },
        },
        {
            $sort: {
                'module.moduleNumber': 1,
                order: 1,
            },
        },
    ]);
    return result;
};
const getLectureById = async (id) => {
    const result = await lecture_model_1.default.findById(id).populate('courseId');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    return result;
};
const updateLecture = async (id, payload) => {
    const result = await lecture_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    return result;
};
const deleteLecture = async (id) => {
    const result = await lecture_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lecture not found');
    }
    return result;
};
const reorderLectures = async (moduleId, lectureIds) => {
    const updatePromises = lectureIds.map((lectureId, index) => lecture_model_1.default.findByIdAndUpdate(lectureId, { order: index + 1 }));
    await Promise.all(updatePromises);
    return await getLecturesByModule(moduleId);
};
exports.LectureServices = {
    createLecture,
    getAllLectures,
    getLecturesByModule,
    getLecturesByCourse,
    getLectureById,
    updateLecture,
    deleteLecture,
    reorderLectures,
};
