import { body } from 'express-validator'
import { Response, Request } from "express";
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
    const { user, session } = await execute({email,password});

    request.session = session;

    return response.status(200).json(user); 
};
