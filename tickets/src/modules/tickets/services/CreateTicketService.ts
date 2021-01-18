import { TicketAlreadyCreatedError } from '../../../shared/error/TicketAlreadyCreatedError';
import TicketDTO from '../../dtos/TicketDTO';
import TicketRepository from '../infra/mongoose/repositories/TicketRepository';

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

    return { ticket: createdTicket };
}