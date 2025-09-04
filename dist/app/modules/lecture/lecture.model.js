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
const lectureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Lecture title is required'],
        trim: true,
        maxlength: [200, 'Lecture title cannot exceed 200 characters'],
    },
    moduleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Module',
        required: [true, 'Module ID is required'],
    },
    videoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true; // Allow empty if videoFile is provided
                return /^https?:\/\//.test(v);
            },
            message: 'Video URL must be a valid HTTP/HTTPS URL',
        },
    },
    videoFile: {
        type: String,
        trim: true,
    },
    pdfNotes: [{
            type: String,
            trim: true,
        }],
    duration: {
        type: Number,
        min: [0, 'Duration cannot be negative'],
    },
    order: {
        type: Number,
        required: [true, 'Lecture order is required'],
        min: [1, 'Order must be at least 1'],
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
// Auto-increment order for each module
lectureSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastLecture = await mongoose_1.default.model('Lecture').findOne({ moduleId: this.moduleId }, {}, { sort: { order: -1 } });
        this.order = lastLecture ? lastLecture.order + 1 : 1;
    }
    next();
});
// Virtual for course ID through module
lectureSchema.virtual('courseId', {
    ref: 'Module',
    localField: 'moduleId',
    foreignField: '_id',
    justOne: true,
    select: 'courseId',
});
// Indexes for efficient queries
lectureSchema.index({ moduleId: 1, order: 1 });
lectureSchema.index({ moduleId: 1, title: 'text' });
const Lecture = mongoose_1.default.model('Lecture', lectureSchema);
exports.default = Lecture;
