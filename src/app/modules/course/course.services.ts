import { ICourse, ICourseFilters } from './course.interface';
import Course from './course.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import EnrollmentRequest from '../enrollment/enrollment.model';
import Module from '../module/module.model';
import Lecture from '../lecture/lecture.model';

const createCourse = async (payload: ICourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourses = async (filters: ICourseFilters) => {
  const courseQuery = new QueryBuilder(Course.find(), filters as Record<string, unknown>)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery
    .populate('modulesCount')
    .populate('totalDuration')
    .populate('enrollmentCount')
    .populate('approvedEnrollmentCount');
  const meta = await courseQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getCourseById = async (id: string, userId?: string) => {
  const result = await Course.findById(id)
    .populate('modulesCount')
    .populate('totalDuration');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // If userId is provided, add enrollment status
  if (userId) {
    const enrollmentRequest = await EnrollmentRequest.findOne({
      userId,
      courseId: id,
    });

    return {
      ...result.toObject(),
      enrollmentStatus: enrollmentRequest?.status || null,
      hasEnrollmentRequest: !!enrollmentRequest,
    };
  }

  return result;
};

const checkCourseAccess = async (courseId: string, userId: string) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (!course.isPublished) {
    throw new AppError(httpStatus.FORBIDDEN, 'Course is not published');
  }

  const enrollmentRequest = await EnrollmentRequest.findOne({
    userId,
    courseId,
  });

  if (!enrollmentRequest) {
    throw new AppError(httpStatus.FORBIDDEN, 'You need to request enrollment for this course');
  }

  if (enrollmentRequest.status !== 'approved') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Your enrollment request is ${enrollmentRequest.status}. Please wait for admin approval.`
    );
  }

  return true;
};

const updateCourse = async (id: string, payload: Partial<ICourse>) => {
  const result = await Course.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  return result;
};

const deleteCourse = async (id: string) => {
  // First, find the course to check if it exists
  const course = await Course.findById(id);
  
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Delete related modules and lectures
  const modules = await Module.find({ courseId: id });
  const moduleIds = modules.map(module => module._id);
  
  // Delete lectures associated with these modules
  await Lecture.deleteMany({ moduleId: { $in: moduleIds } });
  
  // Delete modules
  await Module.deleteMany({ courseId: id });
  
  // Delete enrollment requests for this course
  await EnrollmentRequest.deleteMany({ courseId: id });
  
  // Finally, delete the course
  const result = await Course.findByIdAndDelete(id);

  return result;
};

const getPublishedCourses = async (filters: ICourseFilters, userId?: string) => {
  const publishedFilters = { ...filters, isPublished: true };
  const courseQuery = new QueryBuilder(Course.find(), publishedFilters as Record<string, unknown>)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  // If userId is provided, add enrollment status to each course
  if (userId) {
    const coursesWithEnrollment = await Promise.all(
      result.map(async (course) => {
        const enrollmentRequest = await EnrollmentRequest.findOne({
          userId,
          courseId: course._id,
        });

        return {
          ...course.toObject(),
          enrollmentStatus: enrollmentRequest?.status || null,
          hasEnrollmentRequest: !!enrollmentRequest,
        };
      })
    );

    return {
      meta,
      data: coursesWithEnrollment,
    };
  }

  return {
    meta,
    data: result,
  };
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getPublishedCourses,
  checkCourseAccess,
};
