import { Request, Response, NextFunction } from 'express';
import { LectureServices } from './lecture.services';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ILectureFilters } from './lecture.interface';
import catchAsync from '../../utils/catchAsync';

const createLecture = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await LectureServices.createLecture(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Lecture created successfully',
    data: result,
  });
});

const getAllLectures = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters: ILectureFilters = req.query;
  const result = await LectureServices.getAllLectures(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lectures retrieved successfully',
    data: result.data,
  });
});

const getLecturesByModule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { moduleId } = req.params;
  const result = await LectureServices.getLecturesByModule(moduleId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module lectures retrieved successfully',
    data: result,
  });
});

const getLecturesByCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const result = await LectureServices.getLecturesByCourse(courseId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course lectures retrieved successfully',
    data: result,
  });
});

const getLectureById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await LectureServices.getLectureById(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecture retrieved successfully',
    data: result,
  });
});

const updateLecture = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await LectureServices.updateLecture(id, req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecture updated successfully',
    data: result,
  });
});

const deleteLecture = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await LectureServices.deleteLecture(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecture deleted successfully',
    data: result,
  });
});

const reorderLectures = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { moduleId } = req.params;
  const { lectureIds } = req.body;
  const result = await LectureServices.reorderLectures(moduleId, lectureIds);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lectures reordered successfully',
    data: result,
  });
});

export const LectureControllers = {
  createLecture,
  getAllLectures,
  getLecturesByModule,
  getLecturesByCourse,
  getLectureById,
  updateLecture,
  deleteLecture,
  reorderLectures,
};
