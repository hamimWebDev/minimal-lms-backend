import { Request, Response } from 'express';
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { UserServices } from "./user.services";
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response) => {
  try {

    let creatorRole = 'user'; // default fallback
    const newUser = await UserServices.createUser(req.body, creatorRole);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};
//update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await UserServices.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};  


const getAllUser = async (req: Request, res: Response): Promise<void> => {
  const result = await UserServices.getAllUser();
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });

}
const getAllAdmin = async (req: Request, res: Response): Promise<void> => {
  const result = await UserServices.getAllAdmin();
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result,
  });
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id);
  if (!result) {
    sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
}
// delete admin
  const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await UserServices.deleteAdmin(id);
    if (!result) {
      sendResponse<null>(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin not found",
        data: null,
      });
      return;
    }
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  }
const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id);
   if (!result) {
      sendResponse<null>(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
        data: null,
      });
      return;
    }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single User fetched successfully",
    data: result,
  });
}

const getSingleAdmin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await UserServices.getSingleAdmin(id);
  if (!result) {
    sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Admin not found",
      data: null,
    });
    return;
  }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin fetched successfully",
    data: result,
  });
}


export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await UserServices.changeUserRole(id, role);
  if (!result) {
    sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
};
export const changeUserStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await UserServices.changeUserStatus(id, status);
  if (!result) {
    sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
};



export const UserController = {
  createUser,
  updateUser,
  getAllUser,
  getAllAdmin,
  deleteUser,
  getSingleUser,
  getSingleAdmin,
  deleteAdmin,
  changeUserRole,
  changeUserStatus,

};
