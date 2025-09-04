import { Request, Response, NextFunction } from 'express';
import { CourseServices } from './course.services';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ICourseFilters } from './course.interface';
import catchAsync from '../../utils/catchAsync';

const createCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CourseServices.createCourse(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters: ICourseFilters = req.query;
  const result = await CourseServices.getAllCourses(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    data: result.data,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const result = await CourseServices.getCourseById(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourse(id, req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourse(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});

const getPublishedCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters: ICourseFilters = req.query;
  const userId = req.user?.id;
  const result = await CourseServices.getPublishedCourses(filters, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Published courses retrieved successfully',
    data: result.data,  
  });
});

const checkCourseAccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
      data: null,
    });
    return;
  }

  await CourseServices.checkCourseAccess(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access granted',
    data: null,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getPublishedCourses,
  checkCourseAccess,
};
