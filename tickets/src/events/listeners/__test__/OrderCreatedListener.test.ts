import { OrderCreatedEvent, OrderDTO, OrderStatus } from "@bcmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../../modules/tickets/infra/mongoose/entities/Ticket";
import { natsWrapper } from "../../../shared/infra/clients/NATSStreamServer/NATSWrapper";
import OrderCreatedListener from "../OrderCreatedListener";

interface SetupReturn {
    msg: Message,
    listener: OrderCreatedListener,
    ticket: TicketDoc,
    data: OrderDTO
}

const setup = async (): Promise<SetupReturn> => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdfasdf1',
        expiresAt: 'asdfww',
        ticket: {
            id: ticket.id!,
            price: ticket.price,
            title: ticket.title,
            userId: 'adsfasdf',
            version: ticket.version
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {
        msg,
        ticket,
        data,
        listener
    };
}

describe('Test listener for when an order is created', () => {
    it('should sets the userId of the ticket', async () => {
        const { data, listener, msg, ticket } = await setup();
        await listener.onMessage(data, msg);
        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.orderId).toEqual(data.id);
    });

    it('acks the message', async () => {
        const { data, listener, msg, ticket } = await setup();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });

    it('should publishes a ticket updated event', async () => {
        const { listener, ticket, data, msg } = await setup();

        await listener.onMessage( data, msg );

        expect(natsWrapper.client.publish).toHaveBeenCalled();

        const ticketUpdatedData: TicketDoc = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

        console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
        
        console.log('ticketUpdatedData: ', ticketUpdatedData);
        console.log('data: ', data);
                
        expect(data.id).toEqual(ticketUpdatedData.orderId);
        
    });
});