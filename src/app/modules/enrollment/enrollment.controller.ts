import { Request, Response } from 'express';
import { EnrollmentServices } from './enrollment.services';
import { sendResponse } from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createEnrollmentRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.createEnrollmentRequest(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Enrollment request created successfully',
    data: result,
  });
});

const getAllEnrollmentRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.getAllEnrollmentRequests(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrollment requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getEnrollmentRequestsByUser = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.getEnrollmentRequestsByUser(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User enrollment requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getEnrollmentRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.getEnrollmentRequestById(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrollment request retrieved successfully',
    data: result,
  });
});

const updateEnrollmentRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.updateEnrollmentRequest(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrollment request updated successfully',
    data: result,
  });
});

const deleteEnrollmentRequest = catchAsync(async (req: Request, res: Response) => {
  await EnrollmentServices.deleteEnrollmentRequest(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrollment request deleted successfully',
    data: null,
  });
});

const checkUserEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentServices.checkUserEnrollmentStatus(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrollment status checked successfully',
    data: result,
  });
});

export const EnrollmentControllers = {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  getEnrollmentRequestsByUser,
  getEnrollmentRequestById,
  updateEnrollmentRequest,
  deleteEnrollmentRequest,
  checkUserEnrollmentStatus,
};
