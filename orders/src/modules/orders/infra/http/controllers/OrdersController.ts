import { Response, Request  } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../../mongoose/entities/Ticket';
import mongoose from 'mongoose';
import CreateOrderService from '../../../services/CreateOrderService';

export const createOrderValidations = [
    body('ticketId')
    .not()
    .isEmpty()
    .custom( (input: string) => mongoose.Types.ObjectId.isValid(input) )
    .withMessage('TicketId must be provided.'),
];


export const index = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    return res.send(tickets);
};

export const del = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    return res.send(tickets);
};

export const show = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    return res.send(tickets);
};

export const create = async (req: Request, res: Response) => {
    const { ticketId, } = req.body;
    const userId = req.currentUser!.id;
    const order = await new CreateOrderService().execute({ ticketId, userId});
    return res.status(201).send(order);
};