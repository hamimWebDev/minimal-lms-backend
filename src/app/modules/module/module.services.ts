import { IModule, IModuleFilters } from './module.interface';
import Module from './module.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createModule = async (payload: IModule) => {
  const result = await Module.create(payload);
  return result;
};

const getAllModules = async (filters: IModuleFilters) => {
  const moduleQuery = new QueryBuilder(Module.find(), filters as Record<string, unknown>)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await moduleQuery.modelQuery;
  const meta = await moduleQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getModulesByCourse = async (courseId: string) => {
  const result = await Module.find({ courseId })
    .sort({ moduleNumber: 1 })
    .populate('lecturesCount')
    .populate('totalDuration');

  return result;
};

const getModuleById = async (id: string) => {
  const result = await Module.findById(id)
    .populate('lecturesCount')
    .populate('totalDuration');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return result;
};

const updateModule = async (id: string, payload: Partial<IModule>) => {
  const result = await Module.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return result;
};

const deleteModule = async (id: string) => {
  const result = await Module.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return result;
};

const reorderModules = async (courseId: string, moduleIds: string[]) => {
  const updatePromises = moduleIds.map((moduleId, index) =>
    Module.findByIdAndUpdate(moduleId, { moduleNumber: index + 1 })
  );

  await Promise.all(updatePromises);
  return await getModulesByCourse(courseId);
};

export const ModuleServices = {
  createModule,
  getAllModules,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
  reorderModules,
};
