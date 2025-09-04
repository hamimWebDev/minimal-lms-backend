"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_1 = require("./auth.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate required fields
        if (!name || !email || !password) {
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: "Name, email, and password are required",
                data: null,
            });
            return;
        }
        const result = await auth_services_1.AuthServices.registerUser(name, email, password);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: error.message,
            data: null,
        });
    }
};
// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_services_1.AuthServices.loginUser(email, password);
        // Set refresh token in HttpOnly secure cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production, false in development
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: "/",
            domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
        });
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: error.message,
            data: null,
        });
    }
};
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No refresh token provided!");
    }
    const result = await auth_services_1.AuthServices.refreshToken(refreshToken);
    // Set new refresh token in HttpOnly secure cookie
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: "/",
        domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "New access token generated successfully",
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
});
const logout = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await auth_services_1.AuthServices.logout(refreshToken);
    }
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const logoutAll = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not authenticated!");
    }
    await auth_services_1.AuthServices.logoutAll(userId);
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged out from all devices successfully",
        data: null,
    });
});
exports.AuthController = {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    logoutAll,
};
