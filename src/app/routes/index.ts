
import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BlogRoutes } from "../modules/Blog/blog.routes";
import { CourseRoutes } from "../modules/course/course.route";
import { ModuleRoutes } from "../modules/module/module.route";
import { LectureRoutes } from "../modules/lecture/lecture.route";

import { EnrollmentRoutes } from "../modules/enrollment/enrollment.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/blogs",
        route: BlogRoutes,
    },
    {
        path: "/courses",
        route: CourseRoutes,
    },
    {
        path: "/modules",
        route: ModuleRoutes,
    },
    {
        path: "/lectures",
        route: LectureRoutes,
    },

    {
        path: "/enrollment-requests",
        route: EnrollmentRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route?.path, route?.route));

export default router;
