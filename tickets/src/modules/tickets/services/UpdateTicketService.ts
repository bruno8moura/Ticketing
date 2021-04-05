import { BadRequestError, NotAuthorizedError, NotFoundError } from '@bcmtickets/common';
import { TicketUpdatedPublisher } from '../../../events/publishers/TicketUpdatedPublisher';
import TicketDTO from '../../dtos/TicketDTO';
import TicketRepository from '../infra/mongoose/repositories/TicketRepository';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';

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

    if(ticket.orderId) {
        throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if(ticket.userId !== userId) {
        throw new NotAuthorizedError();
    }

    const updatedTicket = await repo.update({ id, price, title, userId });
    
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: updatedTicket.id!,
        title: updatedTicket.title,
        price: updatedTicket.price,
        userId: updatedTicket.userId,
        version: updatedTicket.version!
    });

    return { ticket: updatedTicket};
}