import { Request, Response, NextFunction } from 'express';
import { ModuleServices } from './module.services';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { IModuleFilters } from './module.interface';

const createModule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ModuleServices.createModule(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Module created successfully',
    data: result,
  });
});

const getAllModules = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters: IModuleFilters = req.query;
  const result = await ModuleServices.getAllModules(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules retrieved successfully',
    data: result.data,
  });
});

const getModulesByCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const result = await ModuleServices.getModulesByCourse(courseId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course modules retrieved successfully',
    data: result,
  });
});

const getModuleById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await ModuleServices.getModuleById(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module retrieved successfully',
    data: result,
  });
});

const updateModule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await ModuleServices.updateModule(id, req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module updated successfully',
    data: result,
  });
});

const deleteModule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await ModuleServices.deleteModule(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module deleted successfully',
    data: result,
  });
});

const reorderModules = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const { moduleIds } = req.body;
  const result = await ModuleServices.reorderModules(courseId, moduleIds);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules reordered successfully',
    data: result,
  });
});

export const ModuleControllers = {
  createModule,
  getAllModules,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
  reorderModules,
};
