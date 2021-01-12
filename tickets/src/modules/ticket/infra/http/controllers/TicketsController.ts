import { body } from 'express-validator'
import { Response, Request } from "express";
import { execute } from '../../../services/CreateTicketService';
export const createTicketValidations = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title must be provided.'),
    body('price')
    .isFloat( { gt: 0 } )
    .withMessage('Price must be greater than 0')
];

export const create = async (request: Request, response: Response): Promise<Response> => {
    const { title, price } = request.body;
    
    const ticketCreated = await execute({
        title,
        price,
        userId: request.currentUser!.id
    });
    
    return response.status(201).json(ticketCreated);
};
