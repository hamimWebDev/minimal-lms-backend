import { z } from 'zod';

const createEnrollmentRequest = z.object({
  body: z.object({
    courseId: z.string({
      required_error: 'Course ID is required',
    }).min(24, 'Invalid course ID').max(24, 'Invalid course ID'),
    
    requestMessage: z.string().max(500, 'Request message cannot exceed 500 characters').optional(),
  }),
});

const updateEnrollmentRequest = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    
    adminResponse: z.string().max(500, 'Admin response cannot exceed 500 characters').optional(),
  }),
});

const getEnrollmentRequests = z.object({
  query: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    
    userId: z.string().min(24, 'Invalid user ID').max(24, 'Invalid user ID').optional(),
    
    courseId: z.string().min(24, 'Invalid course ID').max(24, 'Invalid course ID').optional(),
    
    search: z.string().optional(),
    
    page: z.string().transform(Number).optional(),
    
    limit: z.string().transform(Number).optional(),
  }),
});

export const enrollmentValidation = {
  createEnrollmentRequest,
  updateEnrollmentRequest,
  getEnrollmentRequests,
};
