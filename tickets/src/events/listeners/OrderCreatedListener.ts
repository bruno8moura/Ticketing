import { Listener, OrderCreatedEvent, OrderDTO, Subjects } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../modules/tickets/infra/mongoose/entities/Ticket";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";
import { queueGroupsName } from "./QueueGroupNames";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupsName.ticket;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
        //Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        
        // If no ticket, throw error
        if(!ticket){
            throw new Error('Ticket not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id});

        // Save the ticket
        await ticket.save();
        
        const { id, price, title, userId, version, orderId } = ticket;
        await new TicketUpdatedPublisher(this.client).publish({
            id: id!,
            price,
            title,
            userId,
            version,
            orderId
        });

        // Ack the message
        msg.ack();
    }

}