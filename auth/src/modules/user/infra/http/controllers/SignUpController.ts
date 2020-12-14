import { body, validationResult } from 'express-validator'
import { Response, Request } from "express";
import signUpService from "../../../services/SignUpService";
import RequestError from '../../../../../shared/errors/RequestError';

export const signUpValidations = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid.'),
    body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
]

const signUpController = async (request: Request, response: Response): Promise<Response> => {

    const validations = validationResult(request);

    if(!validations.isEmpty()){
        throw new RequestError(validations);
    }

    const { email, password } = request.body;
    const createdUser = await signUpService({email, password});
    
    return response.status(201).json({successful: true, message: `User ${createdUser.email} created.`});
}

export default signUpController;


