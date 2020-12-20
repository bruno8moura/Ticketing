import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export const index = async (request: Request, response: Response): Promise<Response> => {
    const { session } = request;

    try {
        const payload = jwt.verify(session?.jwt, process.env.JWT_KEY!);        
        return response.status(200).json({currentUser: payload});        
    } catch (error) {
        console.log(error);
        return response.status(404).send({currentUser: null});
    }
};