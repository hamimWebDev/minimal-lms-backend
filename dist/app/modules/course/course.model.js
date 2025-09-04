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
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [100, 'Course title cannot exceed 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Course price is required'],
        min: [0, 'Price cannot be negative'],
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
    },
    thumbnail: {
        type: String,
        required: [true, 'Course thumbnail is required'],
    },
    instructor: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        min: [0, 'Duration cannot be negative'],
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    category: {
        type: String,
        trim: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Virtual for modules count
courseSchema.virtual('modulesCount', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'courseId',
    count: true,
});
// Virtual for total duration
courseSchema.virtual('totalDuration', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'courseId',
    pipeline: [
        {
            $lookup: {
                from: 'lectures',
                localField: '_id',
                foreignField: 'moduleId',
                as: 'lectures',
            },
        },
        {
            $addFields: {
                moduleDuration: { $sum: '$lectures.duration' },
            },
        },
        {
            $group: {
                _id: null,
                totalDuration: { $sum: '$moduleDuration' },
            },
        },
    ],
});
const Course = mongoose_1.default.model('Course', courseSchema);
exports.default = Course;
