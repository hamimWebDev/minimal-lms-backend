import { Request } from 'express';
import { IEnrollmentRequest, IEnrollmentRequestFilters } from './enrollment.interface';
import EnrollmentRequest from './enrollment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import Course from '../course/course.model';
import { User } from '../user/user.model';

const createEnrollmentRequest = async (req: Request) => {
  const { courseId, requestMessage } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if enrollment request already exists
  const existingRequest = await EnrollmentRequest.findOne({
    userId,
    courseId,
  });

  if (existingRequest) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Enrollment request already exists for this course'
    );
  }

  const enrollmentRequest = await EnrollmentRequest.create({
    userId,
    courseId,
    requestMessage,
  });

  return enrollmentRequest;
};

const getAllEnrollmentRequests = async (req: Request) => {
  const queryBuilder = new QueryBuilder(
    EnrollmentRequest.find(),
    req.query as Record<string, unknown>
  )
    .search(['requestMessage', 'adminResponse'])
    .filter()
    .paginate()
    .sort();

  const result = await queryBuilder.modelQuery.populate([
    {
      path: 'userId',
      select: 'name email',
    },
    {
      path: 'courseId',
      select: 'title thumbnail',
    },
    {
      path: 'approvedBy',
      select: 'name email',
    },
  ]);

  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data: result,
  };
};

const getEnrollmentRequestsByUser = async (req: Request) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const queryBuilder = new QueryBuilder(
    EnrollmentRequest.find(),
    { ...req.query, userId } as Record<string, unknown>
  )
    .filter()
    .paginate()
    .sort();

  const result = await queryBuilder.modelQuery.populate([
    {
      path: 'courseId',
      select: 'title thumbnail description instructor',
    },
    {
      path: 'approvedBy',
      select: 'name email',
    },
  ]);

  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data: result,
  };
};

const getEnrollmentRequestById = async (req: Request) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const enrollmentRequest = await EnrollmentRequest.findById(id).populate([
    {
      path: 'userId',
      select: 'name email',
    },
    {
      path: 'courseId',
      select: 'title thumbnail description instructor',
    },
    {
      path: 'approvedBy',
      select: 'name email',
    },
  ]);

  if (!enrollmentRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrollment request not found');
  }

  // Check if user is authorized to view this request
  const userRole = req.user?.role;
  if (userRole !== 'admin' && userRole !== 'superAdmin' && enrollmentRequest.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to view this request');
  }

  return enrollmentRequest;
};

const updateEnrollmentRequest = async (req: Request) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;
  const adminId = req.user?.id;
  const userRole = req.user?.role;

  if (!adminId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (userRole !== 'admin' && userRole !== 'superAdmin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Only admins can update enrollment requests');
  }

  const enrollmentRequest = await EnrollmentRequest.findById(id);

  if (!enrollmentRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrollment request not found');
  }

  if (enrollmentRequest.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot update a request that is not pending'
    );
  }

  const updateData: Partial<IEnrollmentRequest> = {
    status,
    adminResponse,
  };

  if (status === 'approved' || status === 'rejected') {
    updateData.approvedBy = adminId;
    updateData.approvedAt = new Date();
  }

  const updatedRequest = await EnrollmentRequest.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate([
    {
      path: 'userId',
      select: 'name email',
    },
    {
      path: 'courseId',
      select: 'title thumbnail',
    },
    {
      path: 'approvedBy',
      select: 'name email',
    },
  ]);

  return updatedRequest;
};

const deleteEnrollmentRequest = async (req: Request) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const enrollmentRequest = await EnrollmentRequest.findById(id);

  if (!enrollmentRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrollment request not found');
  }

  // Only allow deletion if user is admin or if it's their own pending request
  if (userRole !== 'admin' && userRole !== 'superAdmin') {
    if (enrollmentRequest.userId.toString() !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to delete this request');
    }
    if (enrollmentRequest.status !== 'pending') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot delete a request that is not pending'
      );
    }
  }

  await EnrollmentRequest.findByIdAndDelete(id);

  return null;
};

const checkUserEnrollmentStatus = async (req: Request) => {
  const { courseId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const enrollmentRequest = await EnrollmentRequest.findOne({
    userId,
    courseId,
  });

  return {
    hasRequest: !!enrollmentRequest,
    status: enrollmentRequest?.status || null,
    request: enrollmentRequest,
  };
};

export const EnrollmentServices = {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  getEnrollmentRequestsByUser,
  getEnrollmentRequestById,
  updateEnrollmentRequest,
  deleteEnrollmentRequest,
  checkUserEnrollmentStatus,
};
