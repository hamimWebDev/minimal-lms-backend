import { ILecture, ILectureFilters } from './lecture.interface';
import Lecture from './lecture.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createLecture = async (payload: ILecture) => {
  const result = await Lecture.create(payload);
  return result;
};

const getAllLectures = async (filters: ILectureFilters) => {
  const lectureQuery = new QueryBuilder(Lecture.find(), filters as Record<string, unknown>)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await lectureQuery.modelQuery;
  const meta = await lectureQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getLecturesByModule = async (moduleId: string) => {
  const result = await Lecture.find({ moduleId })
    .sort({ order: 1 })
    .populate('courseId');

  return result;
};

const getLecturesByCourse = async (courseId: string) => {
  const result = await Lecture.aggregate([
    {
      $lookup: {
        from: 'modules',
        localField: 'moduleId',
        foreignField: '_id',
        as: 'module',
      },
    },
    {
      $match: {
        'module.courseId': new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $sort: {
        'module.moduleNumber': 1,
        order: 1,
      },
    },
  ]);

  return result;
};

const getLectureById = async (id: string) => {
  const result = await Lecture.findById(id).populate('courseId');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lecture not found');
  }

  return result;
};

const updateLecture = async (id: string, payload: Partial<ILecture>) => {
  const result = await Lecture.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lecture not found');
  }

  return result;
};

const deleteLecture = async (id: string) => {
  const result = await Lecture.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lecture not found');
  }

  return result;
};

const reorderLectures = async (moduleId: string, lectureIds: string[]) => {
  const updatePromises = lectureIds.map((lectureId, index) =>
    Lecture.findByIdAndUpdate(lectureId, { order: index + 1 })
  );

  await Promise.all(updatePromises);
  return await getLecturesByModule(moduleId);
};

export const LectureServices = {
  createLecture,
  getAllLectures,
  getLecturesByModule,
  getLecturesByCourse,
  getLectureById,
  updateLecture,
  deleteLecture,
  reorderLectures,
};
