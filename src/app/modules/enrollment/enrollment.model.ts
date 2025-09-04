import mongoose, { Schema } from 'mongoose';
import { IEnrollmentRequest } from './enrollment.interface';

const enrollmentRequestSchema = new Schema<IEnrollmentRequest>(
  {
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
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'Request message cannot exceed 500 characters'],
    },
    adminResponse: {
      type: String,
      trim: true,
      maxlength: [500, 'Admin response cannot exceed 500 characters'],
    },
    approvedBy: {
      type: String,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Compound unique index to prevent duplicate requests
enrollmentRequestSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true }
);

// Indexes for efficient queries
enrollmentRequestSchema.index({ status: 1 });
enrollmentRequestSchema.index({ userId: 1 });
enrollmentRequestSchema.index({ courseId: 1 });
enrollmentRequestSchema.index({ createdAt: -1 });

const EnrollmentRequest = mongoose.model<IEnrollmentRequest>(
  'EnrollmentRequest',
  enrollmentRequestSchema
);

export default EnrollmentRequest;
