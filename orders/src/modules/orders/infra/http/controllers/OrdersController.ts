import { Response, Request  } from 'express';
import { Ticket } from '../../mongoose/entities/Ticket';

export const index = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    return res.send(tickets);
};
