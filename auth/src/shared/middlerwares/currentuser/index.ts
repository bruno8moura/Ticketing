import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../../@types/express';

export const currentUser = (request: Request, response: Response, next: NextFunction) => {
    const jwtToken = request.session?.jwt;
    if(jwtToken){
        request.currentUser = jwt.verify(jwtToken, process.env.JWT_KEY!) as UserPayload;
    }
    
    return next();
}