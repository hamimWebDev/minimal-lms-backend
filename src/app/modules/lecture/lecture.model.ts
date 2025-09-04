import mongoose, { Schema } from 'mongoose';
import { ILecture } from './lecture.interface';

const lectureSchema = new Schema<ILecture>(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
      maxlength: [200, 'Lecture title cannot exceed 200 characters'],
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required'],
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty if videoFile is provided
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Auto-increment order for each module
lectureSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastLecture = await mongoose.model('Lecture').findOne(
      { moduleId: this.moduleId },
      {},
      { sort: { order: -1 } }
    );
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

const Lecture = mongoose.model<ILecture>('Lecture', lectureSchema);

export default Lecture;
