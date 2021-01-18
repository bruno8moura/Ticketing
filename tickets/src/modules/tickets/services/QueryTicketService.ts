import { NotFoundError } from '@bcmtickets/common';
import TicketDTO from '../../dtos/TicketDTO';
import TicketRepository from '../infra/mongoose/repositories/TicketRepository';

interface IRequest {
    id: string;
}

interface IResponse {
    ticket: TicketDTO;
}

export const execute = async ( { id }: IRequest): Promise<IResponse> => {
    const ticket = await new TicketRepository().findById({id});
    
    if(!ticket){
        throw new NotFoundError();
    }

    return { ticket };        
}