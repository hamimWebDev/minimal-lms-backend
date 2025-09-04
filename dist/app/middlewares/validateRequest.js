"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Assuming catchAsync utility path
const validateRequest = (schema) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
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
exports.default = validateRequest;
