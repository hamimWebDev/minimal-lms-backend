import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility path

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body, query parameters, and route parameters
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies, // Optionally validate cookies if needed
    });

    // If validation is successful, proceed to the next middleware/controller
    next();
  });
};

export default validateRequest; 