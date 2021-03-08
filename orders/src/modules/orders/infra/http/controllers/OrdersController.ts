import { Response, Request  } from 'express';
import { body, param } from 'express-validator';
import { Ticket } from '../../mongoose/entities/Ticket';
import mongoose from 'mongoose';
import CreateOrderService from '../../../services/CreateOrderService';
import ListOrderService from '../../../services/ListOrderService';
import { OrderStatus, getOrderStatus } from '@bcmtickets/common';
import FindByIdOrderService from '../../../services/FindByIdOrderService';
import DeleteOrderService from '../../../services/DeleteOrderService';

export const createOrderValidations = [
    body('ticketId')
    .not()
    .isEmpty()
    .custom( (input: string) => mongoose.Types.ObjectId.isValid(input) )
    .withMessage('TicketId must be provided.'),
];

export const deleteOrderValidations = [
    body('orderId')
    .not()
    .isEmpty()
    .custom( (input: string) => mongoose.Types.ObjectId.isValid(input) )
    .withMessage('OrderId must be provided.'),
];

export const index = async (req: Request, res: Response) => {
    
    const userId = req.currentUser!.id;
    const orderList = await new ListOrderService().execute({ userId });
    
    return res.status(200).send({ docs: orderList});
};

export const del = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const userId = req.currentUser!.id;
    
    await new DeleteOrderService().execute({orderId, userId});
    return res.status(204).send();
};

export const show = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await new FindByIdOrderService().execute({orderId: `${orderId}`, userId: req.currentUser!.id})
    return res.send( order );
};

export const create = async (req: Request, res: Response) => {
    const { ticketId, } = req.body;
    const userId = req.currentUser!.id;
    const order = await new CreateOrderService().execute({ ticketId, userId});
    return res.status(201).send(order);
};