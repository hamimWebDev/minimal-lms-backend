"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.changeUserStatus = exports.changeUserRole = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const user_services_1 = require("./user.services");
const http_status_1 = __importDefault(require("http-status"));
const createUser = async (req, res) => {
    try {
        let creatorRole = 'user'; // default fallback
        const newUser = await user_services_1.UserServices.createUser(req.body, creatorRole);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};
//update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await user_services_1.UserServices.updateUser(id, req.body);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};
const getAllUser = async (req, res) => {
    const result = await user_services_1.UserServices.getAllUser();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
};
const getAllAdmin = async (req, res) => {
    const result = await user_services_1.UserServices.getAllAdmin();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admins fetched successfully",
        data: result,
    });
};
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.UserServices.deleteUser(id);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "User not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
};
// delete admin
const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.UserServices.deleteAdmin(id);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Admin not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
};
const getSingleUser = async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.UserServices.getSingleUser(id);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "User not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single User fetched successfully",
        data: result,
    });
};
const getSingleAdmin = async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.UserServices.getSingleAdmin(id);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Admin not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin fetched successfully",
        data: result,
    });
};
const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await user_services_1.UserServices.changeUserRole(id, role);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "User not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User role updated successfully",
        data: result,
    });
};
exports.changeUserRole = changeUserRole;
const changeUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await user_services_1.UserServices.changeUserStatus(id, status);
    if (!result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "User not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
};
exports.changeUserStatus = changeUserStatus;
exports.UserController = {
    createUser,
    updateUser,
    getAllUser,
    getAllAdmin,
    deleteUser,
    getSingleUser,
    getSingleAdmin,
    deleteAdmin,
    changeUserRole: exports.changeUserRole,
    changeUserStatus: exports.changeUserStatus,
};
