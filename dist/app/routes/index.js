"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const blog_routes_1 = require("../modules/Blog/blog.routes");
const course_route_1 = require("../modules/course/course.route");
const module_route_1 = require("../modules/module/module.route");
const lecture_route_1 = require("../modules/lecture/lecture.route");
const enrollment_route_1 = require("../modules/enrollment/enrollment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/blogs",
        route: blog_routes_1.BlogRoutes,
    },
    {
        path: "/courses",
        route: course_route_1.CourseRoutes,
    },
    {
        path: "/modules",
        route: module_route_1.ModuleRoutes,
    },
    {
        path: "/lectures",
        route: lecture_route_1.LectureRoutes,
    },
    {
        path: "/enrollment-requests",
        route: enrollment_route_1.EnrollmentRoutes,
    }
];
moduleRoutes.forEach((route) => router.use(route?.path, route?.route));
exports.default = router;
