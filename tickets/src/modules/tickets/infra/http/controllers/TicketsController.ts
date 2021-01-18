import { body } from 'express-validator'
import { Response, Request } from "express";
import { execute as queryTicket } from '../../../services/QueryTicketService';
import { execute as createTicket } from '../../../services/CreateTicketService';
import { execute as updateTicket } from '../../../services/UpdateTicketService';
import TicketRepository from '../../mongoose/repositories/TicketRepository';

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
    
    const ticketCreated = await createTicket({
        title,
        price,
        userId: request.currentUser!.id
    });
    
    return response.status(201).json(ticketCreated);
};

export const show = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;
    
    const existingTicket = await queryTicket( { id } );
    
    return response.status(200).send(existingTicket);
};

export const index = async (request: Request, response: Response): Promise<Response> => {
    const foundTickets = await new TicketRepository().find({});
    
    return response.status(200).send({ docs: foundTickets });
};

export const update = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;
    
    const { body: { title, price } } = request;
    
    const userId = request.currentUser!.id;
    
    const updatedTicket = await updateTicket({
        id, title, price, userId
    });
    
    return response.status(200).send(updatedTicket);
};
