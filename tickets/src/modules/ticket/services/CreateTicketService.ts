import { TicketAlreadyCreatedError } from '../../../shared/error/TicketAlreadyCreatedError';
import { Ticket, TicketDoc } from '../../models/Ticket';

interface IRequest {
    title: string;
    price: number;
    userId: string;
}

interface IResponse {
    ticket: TicketDoc;
}

export const execute = async ({title, price, userId}: IRequest): Promise<IResponse> => {
    const existingTicket = await Ticket.findOne( { title, userId } );

    if(existingTicket){
        throw new TicketAlreadyCreatedError('Ticket already created to user.');
    }

    const createdTicket = Ticket.build({title, price, userId});
    await createdTicket.save();    
    return { ticket: createdTicket };        
}