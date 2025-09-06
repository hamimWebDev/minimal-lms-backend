"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFoundRoute_1 = require("./app/middlewares/notFoundRoute");
const routes_1 = __importDefault(require("./app/routes"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://minimal-lms-frontend-six.vercel.app", "https://minimal-lms-frontend.netlify.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// compression middleware
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
// application routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello next level LMS Management System Project!!");
});
// global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
// handle not found route
app.use(notFoundRoute_1.notFoundRoute);
exports.default = app;
