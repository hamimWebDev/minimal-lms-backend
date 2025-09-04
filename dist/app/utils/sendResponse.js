"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        data: data.data,
        ...(data.meta && { meta: data.meta }),
    };
    return res.status(200).json(responseData);
};
exports.sendResponse = sendResponse;
