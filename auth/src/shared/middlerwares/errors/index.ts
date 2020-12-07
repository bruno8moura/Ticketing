import { Response, Request, NextFunction } from "express";
import AppError from "../../errors/AppError";

const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        console.log(err);
        if(err instanceof AppError){
            return res.status(err.statusCode).json(err.serializedError());
        }

        return res.status(500).json({status: 'server.error', messages: [err.message]});
};

export default errorHandler;

