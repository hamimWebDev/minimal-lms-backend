"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const multer_config_1 = require("../../config/multer.config");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', multer_config_1.multerUpload.single('file'), (req, res, next) => {
    if (!req.file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No cover image uploaded for the blog');
    }
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)(["admin"]), blog_controller_1.BlogControllers.createBlog);
router.put('/:id', multer_config_1.multerUpload.single('file'), (req, res, next) => {
    if (req.file) {
        req.body = {
            ...JSON.parse(req.body.data),
            coverImage: req.file.path,
        };
    }
    else {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, auth_1.default)(["admin"]), blog_controller_1.BlogControllers.updateBlog);
router.get('/', blog_controller_1.BlogControllers.getAllBlogs);
router.get('/:id', blog_controller_1.BlogControllers.getBlogById);
router.delete('/:id', (0, auth_1.default)(["admin"]), blog_controller_1.BlogControllers.deleteBlog);
exports.BlogRoutes = router;
