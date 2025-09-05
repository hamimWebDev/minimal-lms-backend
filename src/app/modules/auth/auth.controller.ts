import { AuthServices } from "./auth.services";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Name, email, and password are required",
        data: null,
      });
      return;
    }

    const result = await AuthServices.registerUser(name, email, password);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthServices.loginUser(email, password);

  // Set refresh token in HttpOnly secure cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production, false in development
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
    domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "No refresh token provided!");
  }
  
  const result = await AuthServices.refreshToken(refreshToken);
  
  // Set new refresh token in HttpOnly secure cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
    domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
  });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New access token generated successfully",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    await AuthServices.logout(refreshToken);
  }
  
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
  });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const logoutAll = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated!");
  }
  
  await AuthServices.logoutAll(userId);
  
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
  });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out from all devices successfully",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  logoutAll,
}