import { NextFunction, Request, RequestHandler, Response } from "express";

// hire order function
const catchAsync = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error: any) => next(error));
    }
}

export default catchAsync;