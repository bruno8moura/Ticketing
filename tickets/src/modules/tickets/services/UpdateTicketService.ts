import { NotAuthorizedError, NotFoundError } from '@bcmtickets/common';
import TicketDTO from '../../dtos/TicketDTO';
import TicketRepository from '../infra/mongoose/repositories/TicketRepository';

interface IRequest {
    id: string;
    title: string;
    price: number;
    userId: string;
}

interface IResponse {
    ticket: TicketDTO;
}

export const execute = async ( { id, price, title, userId }: IRequest): Promise<IResponse> => {
    const repo = new TicketRepository();
    const ticket = await repo.findById({id});
    
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== userId) {
        throw new NotAuthorizedError();
    }

    const updatedTicket = await repo.update({ id, price, title, userId });

    return { ticket: updatedTicket};
}