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
const moduleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Module title is required'],
        trim: true,
        maxlength: [100, 'Module title cannot exceed 100 characters'],
    },
    moduleNumber: {
        type: Number,
        required: [true, 'Module number is required'],
        min: [1, 'Module number must be at least 1'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required'],
    },
    description: {
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
// Auto-increment module number for each course
moduleSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastModule = await mongoose_1.default.model('Module').findOne({ courseId: this.courseId }, {}, { sort: { moduleNumber: -1 } });
        this.moduleNumber = lastModule ? lastModule.moduleNumber + 1 : 1;
    }
    next();
});
// Virtual for lectures count
moduleSchema.virtual('lecturesCount', {
    ref: 'Lecture',
    localField: '_id',
    foreignField: 'moduleId',
    count: true,
});
// Virtual for total duration
moduleSchema.virtual('totalDuration', {
    ref: 'Lecture',
    localField: '_id',
    foreignField: 'moduleId',
    pipeline: [
        {
            $group: {
                _id: null,
                totalDuration: { $sum: '$duration' },
            },
        },
    ],
});
// Index for efficient queries
moduleSchema.index({ courseId: 1, moduleNumber: 1 });
const Module = mongoose_1.default.model('Module', moduleSchema);
exports.default = Module;
