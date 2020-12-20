import { Response, Request } from 'express';

export const index = async (request: Request, response: Response): Promise<Response> => {
    return response.json(request.currentUser ? {currentUser: request.currentUser} : {currentUser: null});
};