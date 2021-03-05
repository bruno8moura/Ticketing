import { Response, Request  } from 'express';
import { body, param } from 'express-validator';
import { Ticket } from '../../mongoose/entities/Ticket';
import mongoose from 'mongoose';
import CreateOrderService from '../../../services/CreateOrderService';
import ListOrderService from '../../../services/ListOrderService';
import { OrderStatus, getOrderStatus } from '@bcmtickets/common';

export const createOrderValidations = [
    body('ticketId')
    .not()
    .isEmpty()
    .custom( (input: string) => mongoose.Types.ObjectId.isValid(input) )
    .withMessage('TicketId must be provided.'),
];

export const listOrdersValidations = [
    param('status')
    .not()
    .isEmpty()
    .custom((input: string) => [OrderStatus.Created, OrderStatus.Complete, OrderStatus.Cancelled, OrderStatus.AwaitingPayment])
    .withMessage(`Invalid order status. The status valid are ${JSON.stringify(OrderStatus)}`)
];

export const index = async (req: Request, res: Response) => {
    
    const userId = req.currentUser!.id;
    const orderList = await new ListOrderService().execute({ userId });
    
    return res.status(200).send({ docs: orderList});
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