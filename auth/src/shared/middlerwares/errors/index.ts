import { Response, Request, NextFunction } from "express";
import AppError from "../../errors/AppError";
import { uuid } from "uuidv4";

const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        //to implement request id
        const reqid = uuid();

        //to implement logs here
        console.log(`${reqid}:::${err.message}`);
        if(err instanceof AppError){
            return res.status(err.statusCode).json(err.serializedError());
        }

        //to implement logs here
        console.error(`${reqid}:::${err.message}`);

        return res.status(500).json({status: 'server.error', messages: ['Please contact system administrator.']});
};

export default errorHandler;
