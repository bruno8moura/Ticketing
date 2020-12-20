import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../../@types/express';

export const currentUser = (request: Request, response: Response, next: NextFunction) => {
    try {
        const payload = jwt.verify(request.session?.jwt, process.env.JWT_KEY!) as UserPayload;
        request.currentUser = payload;
    } catch (error) {
        console.log(error);
    }

    return next();
}