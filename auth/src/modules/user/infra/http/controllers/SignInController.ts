import { body } from 'express-validator'
import { Response, Request } from "express";
import { setJwtInSession } from '../../../../../shared/utils/jwt';
import { execute } from "../../../services/SignInService";

export const signInValidations = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid.'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

export const create = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body;
    const { tokenJWT } = await execute({email,password});
    setJwtInSession( request.session, tokenJWT );
    
    return response.status(200).json({ok: true}); 
};
