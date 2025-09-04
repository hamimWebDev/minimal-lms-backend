import { z } from 'zod';

const createModule = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Module title is required',
    }).min(1, 'Module title cannot be empty').max(100, 'Module title cannot exceed 100 characters'),
    
    moduleNumber: z.coerce.number({
      required_error: 'Module number is required',
    }).min(1, 'Module number must be at least 1'),
    
    courseId: z.string({
      required_error: 'Course ID is required',
    }).min(24, 'Invalid course ID').max(24, 'Invalid course ID'),
    
    description: z.string().optional(),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

const updateModule = z.object({
  body: z.object({
    title: z.string().min(1, 'Module title cannot be empty').max(100, 'Module title cannot exceed 100 characters').optional(),
    
    moduleNumber: z.coerce.number().min(1, 'Module number must be at least 1').optional(),
    
    courseId: z.string().min(24, 'Invalid course ID').max(24, 'Invalid course ID').optional(),
    
    description: z.string().optional(),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

const reorderModules = z.object({
  body: z.object({
    moduleIds: z.array(z.string().min(24, 'Invalid module ID').max(24, 'Invalid module ID')).min(1, 'At least one module ID is required'),
  }),
});

export const moduleValidation = {
  createModule,
  updateModule,
  reorderModules,
};
