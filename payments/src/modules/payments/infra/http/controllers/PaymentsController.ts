import express,{Request, Response} from 'express';
import { body } from 'express-validator';
import { execute } from '../../../services/CreatePaymentService';

export const createPaymentsValidations = [
    body('token')
    .not()
    .isEmpty()
    .withMessage("'token' is invalid"),
    body('orderId')
    .not()
    .isEmpty()
    .withMessage("'orderId' is invalid"),
];

export const create = async (request: Request, response: Response) => {
    const { token, orderId } = request.body;

    const result = await execute({
        token,
        orderId,
        currentUserId: request.currentUser!.id
    });

    return response.status(201).send(result);
};

