import { Listener, Subjects, TicketCreatedEvent, TicketDTO } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../modules/orders/infra/mongoose/entities/Ticket";
import { queueGroupsName } from './QueueGroupNames';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupsName.order;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, price, title } = data;
        const ticket = Ticket.build({
            id,
            price,
            title
        });

        await ticket.save();
        msg.ack();
    }    
}