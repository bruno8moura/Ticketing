import { Listener, Subjects, TicketUpdatedEvent } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../modules/orders/infra/mongoose/entities/Ticket";
import { queueGroupsName } from './QueueGroupNames';

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupsName.order;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        console.log('data: ', data);
        //console.log( data );
        
        const { id, price, title, version } = data;
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: version -1
        });

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set( { title, price } );
        await ticket.save();
        
        msg.ack();
    }    
}