import { body, validationResult } from 'express-validator'
import { Response, Request } from "express";
import { execute } from "../../../services/SignUpService";

export const signUpValidations = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid.'),
    body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
];

export const create = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body;
    const { user, session } = await execute({email, password});

    request.session = session;
    
    return response.status(201).json(user);
};