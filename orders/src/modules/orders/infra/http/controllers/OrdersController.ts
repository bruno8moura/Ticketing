import { Response, Request  } from 'express';
import { Ticket } from '../../mongoose/entities/Ticket';

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
    const tickets = await Ticket.find({});
    return res.send(tickets);
};