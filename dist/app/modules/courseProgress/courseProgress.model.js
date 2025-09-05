"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseProgressSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    courseId: {
        type: String,
        ref: 'Course',
        required: [true, 'Course ID is required'],
    },
    unlockedLectures: [{
            type: String,
            ref: 'Lecture',
        }],
    completedLectures: [{
            type: String,
            ref: 'Lecture',
        }],
    currentLectureId: {
        type: String,
        ref: 'Lecture',
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: [0, 'Progress percentage cannot be negative'],
        max: [100, 'Progress percentage cannot exceed 100'],
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Compound unique index to prevent duplicate progress records
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
// Indexes for efficient queries
courseProgressSchema.index({ userId: 1 });
courseProgressSchema.index({ courseId: 1 });
courseProgressSchema.index({ progressPercentage: 1 });
courseProgressSchema.index({ lastAccessedAt: -1 });
// Virtual for total lectures in course
courseProgressSchema.virtual('totalLectures', {
    ref: 'Course',
    localField: 'courseId',
    foreignField: '_id',
    pipeline: [
        {
            $lookup: {
                from: 'modules',
                localField: '_id',
                foreignField: 'courseId',
                as: 'modules',
            },
        },
        {
            $lookup: {
                from: 'lectures',
                localField: 'modules._id',
                foreignField: 'moduleId',
                as: 'lectures',
            },
        },
        {
            $project: {
                totalLectures: { $size: '$lectures' },
            },
        },
    ],
});
// Pre-save middleware to calculate progress percentage
courseProgressSchema.pre('save', async function (next) {
    if (this.isModified('completedLectures') || this.isModified('unlockedLectures')) {
        try {
            // Get total lectures count for this course
            const Course = mongoose_1.default.model('Course');
            const Module = mongoose_1.default.model('Module');
            const Lecture = mongoose_1.default.model('Lecture');
            const course = await Course.findById(this.courseId);
            if (!course) {
                return next(new Error('Course not found'));
            }
            const modules = await Module.find({ courseId: this.courseId });
            const moduleIds = modules.map(module => module._id);
            const totalLectures = await Lecture.countDocuments({
                moduleId: { $in: moduleIds },
                isPublished: true
            });
            if (totalLectures > 0) {
                this.progressPercentage = Math.round((this.completedLectures.length / totalLectures) * 100);
            }
            else {
                this.progressPercentage = 0;
            }
            // Update last accessed time
            this.lastAccessedAt = new Date();
        }
        catch (error) {
            return next(error);
        }
    }
    next();
});
const CourseProgress = mongoose_1.default.model('CourseProgress', courseProgressSchema);
exports.default = CourseProgress;
