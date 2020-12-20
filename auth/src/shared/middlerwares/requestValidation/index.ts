import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../../errors/RequestValidationError";

export const requestValidation = (request: Request, response: Response, next: NextFunction) => {
    const validations = validationResult(request);
    
    if(!validations.isEmpty()){
        throw new RequestValidationError(validations);
    }

    return next();
}