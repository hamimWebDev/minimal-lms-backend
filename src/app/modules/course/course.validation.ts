import { z } from 'zod';

const createCourse = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Course title is required',
    }).min(1, 'Course title cannot be empty').max(100, 'Course title cannot exceed 100 characters'),
    
    price: z.coerce.number({
      required_error: 'Course price is required',
    }).min(0, 'Price cannot be negative'),
    
    description: z.string({
      required_error: 'Course description is required',
    }).min(1, 'Course description cannot be empty'),
    
    thumbnail: z.string({
      required_error: 'Course thumbnail is required',
    }),
    
    instructor: z.string().optional(),
    
    duration: z.coerce.number().min(0, 'Duration cannot be negative').optional(),
    
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    
    category: z.string().optional(),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

const updateCourse = z.object({
  body: z.object({
    title: z.string().min(1, 'Course title cannot be empty').max(100, 'Course title cannot exceed 100 characters').optional(),
    
    price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
    
    description: z.string().min(1, 'Course description cannot be empty').optional(),
    
    thumbnail: z.string().optional(),
    
    instructor: z.string().optional(),
    
    duration: z.coerce.number().min(0, 'Duration cannot be negative').optional(),
    
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    
    category: z.string().optional(),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

export const courseValidation = {
  createCourse,
  updateCourse,
};
