import { Response, Request } from 'express';

export const signOut = async (request: Request, response: Response): Promise<Response> => {
    request.session = null;
    return response.send({});
};