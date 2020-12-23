import { Response, Request, NextFunction } from "express";
import AppError from "../../errors/AppError";
import { v4 } from "uuid";
import InvalidJsonError from "../../errors/InvalidJsonError";

const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        //to implement request id
        const reqid = v4();

        //to implement logs here
        //console.log(`${reqid}:::`, err);
        if(err instanceof AppError){
            return res.status(err.statusCode).json(err.serializedError());
        }

        if(err instanceof SyntaxError){
            const invalidJson = new InvalidJsonError(err.message);
            return res.status(invalidJson.statusCode).json(invalidJson.serializedError());
        }

        //to implement logs here
        //console.error(`${reqid}:::${err.stack}`);

        return res.status(500).json({status: 'server.error', messages: ['Please contact system administrator.']});
};

export default errorHandler;
