"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRoute = void 0;
const notFoundRoute = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API not found",
        error: "Not Found",
    });
};
exports.notFoundRoute = notFoundRoute;
