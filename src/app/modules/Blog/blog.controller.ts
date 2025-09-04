import { Request, Response } from 'express';
import { BlogServices } from './blog.services';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';


export const BlogControllers = {
  createBlog: catchAsync(async (req: Request, res: Response) => {
    const blogData = req.body;
    const file = req.file;
    const result = await BlogServices.addBlog(blogData, file);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Blog created successfully',
      data: result,
    });
  }),

  getAllBlogs: catchAsync(async (req: Request, res: Response) => {
    const result = await BlogServices.getAllBlogs();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blogs retrieved successfully',
      data: result,
    });
  }),

  getBlogById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await BlogServices.getBlogById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog retrieved successfully',
      data: result,
    });
  }),

  updateBlog: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const blogData = req.body;
    const file = req.file;
    const result = await BlogServices.updateBlog(id, blogData, file);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog updated successfully',
      data: result,
    });
  }),

  deleteBlog: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await BlogServices.deleteBlog(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog deleted successfully',
      data: result,
    });
  }),
};
