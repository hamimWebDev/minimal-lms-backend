"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
const blog_services_1 = require("./blog.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
exports.BlogControllers = {
    createBlog: (0, catchAsync_1.default)(async (req, res) => {
        const blogData = req.body;
        const file = req.file;
        const result = await blog_services_1.BlogServices.addBlog(blogData, file);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Blog created successfully',
            data: result,
        });
    }),
    getAllBlogs: (0, catchAsync_1.default)(async (req, res) => {
        const result = await blog_services_1.BlogServices.getAllBlogs();
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Blogs retrieved successfully',
            data: result,
        });
    }),
    getBlogById: (0, catchAsync_1.default)(async (req, res) => {
        const id = req.params.id;
        const result = await blog_services_1.BlogServices.getBlogById(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Blog retrieved successfully',
            data: result,
        });
    }),
    updateBlog: (0, catchAsync_1.default)(async (req, res) => {
        const id = req.params.id;
        const blogData = req.body;
        const file = req.file;
        const result = await blog_services_1.BlogServices.updateBlog(id, blogData, file);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Blog updated successfully',
            data: result,
        });
    }),
    deleteBlog: (0, catchAsync_1.default)(async (req, res) => {
        const id = req.params.id;
        const result = await blog_services_1.BlogServices.deleteBlog(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Blog deleted successfully',
            data: result,
        });
    }),
};
