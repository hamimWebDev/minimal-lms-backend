import mongoose, { Schema } from 'mongoose';
import { IModule } from './module.interface';

const moduleSchema = new Schema<IModule>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Auto-increment module number for each course
moduleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastModule = await mongoose.model('Module').findOne(
      { courseId: this.courseId },
      {},
      { sort: { moduleNumber: -1 } }
    );
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

const Module = mongoose.model<IModule>('Module', moduleSchema);

export default Module;
