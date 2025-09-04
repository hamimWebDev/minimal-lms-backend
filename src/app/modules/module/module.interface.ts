import mongoose from 'mongoose';

export interface IModule {
  title: string;
  moduleNumber: number;
  courseId: mongoose.Types.ObjectId;
  description?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IModuleFilters {
  courseId?: string;
  search?: string;
  isPublished?: boolean;
}
