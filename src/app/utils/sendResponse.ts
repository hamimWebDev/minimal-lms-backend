import { Response } from "express";

interface IApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: any;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
    const responseData: IApiResponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        data: data.data,
        ...(data.meta && { meta: data.meta }),
    };
    return res.status(data.statusCode).json(responseData);
};


