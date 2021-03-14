import { Listener, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../modules/orders/infra/mongoose/entities/Ticket";
import { queueGroupsName } from './QueueGroupNames';

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupsName.order;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, price, title } = data;
        const ticket = await Ticket.findById(id);

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set( { title, price } );
        await ticket.save();
        
        msg.ack();
    }    
}