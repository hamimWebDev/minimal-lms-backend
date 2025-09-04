import mongoose from 'mongoose';

export interface ILecture {
  title: string;
  moduleId: mongoose.Types.ObjectId;
  videoUrl?: string;
  videoFile?: string;
  pdfNotes: string[];
  duration?: number;
  order: number;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILectureFilters {
  moduleId?: string;
  courseId?: string;
  search?: string;
  isPublished?: boolean;
}
