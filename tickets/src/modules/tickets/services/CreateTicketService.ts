import { TicketAlreadyCreatedError } from '../../../shared/error/TicketAlreadyCreatedError';
import TicketDTO from '../../dtos/TicketDTO';
import TicketRepository from '../infra/mongoose/repositories/TicketRepository';
import { TicketCreatedPublisher } from '../../../events/publishers/TicketCreatedPublisher';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';

interface IRequest {
    title: string;
    price: number;
    userId: string;
}

interface IResponse {
    ticket: TicketDTO;
}

export const execute = async ({title, price, userId}: IRequest): Promise<IResponse> => {
    const ticketRepo = new TicketRepository();
    const existingTicket = await ticketRepo.findOne( { title, userId } );

    if(existingTicket){
        throw new TicketAlreadyCreatedError('Ticket already created to user.');
    }

    const createdTicket = await ticketRepo.create({title, price, userId});
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: createdTicket.id!,
        title: createdTicket.title,
        price: createdTicket.price,
        userId: createdTicket.userId,
        version: createdTicket.version!
    });

    return { ticket: createdTicket };
}