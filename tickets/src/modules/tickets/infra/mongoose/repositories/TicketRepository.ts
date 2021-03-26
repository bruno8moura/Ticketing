import TicketDTO from "../../../../dtos/TicketDTO";
import ITicketRepository, { Filter, FindByIdFilter } from "../../../repositories/ITicketRepository";
import { ObjectID } from 'mongodb';
import { Ticket } from "../entities/Ticket";

export default class TicketRepository implements ITicketRepository {
    async update({id, price, title, userId}: TicketDTO): Promise<TicketDTO> {
        const ticket = await Ticket.findById( id );

        ticket?.set({
            title,
            price
        });

        await ticket?.save();

        return {
            title,
            price,
            userId,
            id,
            version: ticket?.version
        };

    }
    async find( filter: Filter): Promise<TicketDTO[]> {
        const tickets = await Ticket.find( filter );

        if(!tickets){
            return [];
        }

        return tickets.map(({id, price, title, userId, createdAt}) => ({id,price,title,userId,createdAt}));
    }
    async create( { title, price, userId }: TicketDTO ): Promise<TicketDTO> {
        const ticket = Ticket.build( { title, price, userId } );
        await ticket.save();

        return {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            createdAt: ticket.createdAt,
            version: ticket.version
        };
    }

    async findOne({ title, userId }: Filter): Promise<TicketDTO | undefined> {
        const ticket = await Ticket.findOne( { title, userId } );

        if(!ticket){
            return;
        }

        return {
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            createdAt: ticket.createdAt
        };
    }

    async findById({id}: FindByIdFilter): Promise<TicketDTO | undefined> {
        const isAValidId = id ? ObjectID.isValid(id): false;
        if(!isAValidId) {
            return;
        }
        
        const ticket = await Ticket.findById( id );
        
        if(!ticket){
            return;
        }

        return {
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            createdAt: ticket.createdAt
        };
    }    
}