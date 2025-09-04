import { z } from 'zod';

const createLecture = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Lecture title is required',
    }).min(1, 'Lecture title cannot be empty').max(200, 'Lecture title cannot exceed 200 characters'),
    
    moduleId: z.string({
      required_error: 'Module ID is required',
    }).min(24, 'Invalid module ID').max(24, 'Invalid module ID'),
    
    videoUrl: z.string().optional(),
    
    videoFile: z.string().optional(),
    
    pdfNotes: z.array(z.string()).optional(),
    
    duration: z.coerce.number().min(0, 'Duration cannot be negative').optional(),
    
    order: z.coerce.number({
      required_error: 'Lecture order is required',
    }).min(1, 'Order must be at least 1'),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

const updateLecture = z.object({
  body: z.object({
    title: z.string().min(1, 'Lecture title cannot be empty').max(200, 'Lecture title cannot exceed 200 characters').optional(),
    
    moduleId: z.string().min(24, 'Invalid module ID').max(24, 'Invalid module ID').optional(),
    
    videoUrl: z.string().optional(),
    
    videoFile: z.string().optional(),
    
    pdfNotes: z.array(z.string()).optional(),
    
    duration: z.coerce.number().min(0, 'Duration cannot be negative').optional(),
    
    order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
    
    isPublished: z.coerce.boolean().optional(),
  }),
});

const reorderLectures = z.object({
  body: z.object({
    lectureIds: z.array(z.string().min(24, 'Invalid lecture ID').max(24, 'Invalid lecture ID')).min(1, 'At least one lecture ID is required'),
  }),
});

export const lectureValidation = {
  createLecture,
  updateLecture,
  reorderLectures,
};
