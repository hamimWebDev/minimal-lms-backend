import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from './course.interface';

const courseSchema = new Schema<ICourse>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

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

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
