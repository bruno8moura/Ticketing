import { Request, Response, NextFunction } from 'express';
import NotAuthorizedError from '../../errors/NotAuthorizedError';

export const auth = (request: Request, response: Response, next: NextFunction) => {
    if(!request.currentUser){
        throw new NotAuthorizedError();
    }

    return next();
};