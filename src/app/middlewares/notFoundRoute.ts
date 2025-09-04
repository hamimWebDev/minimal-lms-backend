import { NextFunction, Request, Response } from "express";

export const notFoundRoute = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        success: false,
        message: "API not found",
        error: "Not Found",
    });
};
