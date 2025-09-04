import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoute";
import router from "./app/routes";
import compression from "compression";
import cookieParser from "cookie-parser";
const app = express();

// parser
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000","https://minimal-lms-frontend-six.vercel.app"],
    credentials: true,
  })
);
// compression middleware
app.use(compression());
app.use(cookieParser())
// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello next level LMS Management System Project!!");
});

// global error handler
app.use(globalErrorHandler);

// handle not found route
app.use(notFoundRoute);

export default app;
