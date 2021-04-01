import { Ticket } from '../../../modules/tickets/infra/mongoose/entities/Ticket';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import { OrderCancelledListener } from '../OrderCancelledListener';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@bcmtickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'asdf',
    });

    ticket.set({orderId});
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        status: OrderStatus.Cancelled,
        userId: 'asdfasdf',
        expiresAt: 'adsfasdf',
        ticket: {
            id: ticket.id!,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        msg,
        ticket,
        data,
        listener,
        orderId
    };
}

it('should updates the ticket', async () => {
    const { data: order, listener, msg, ticket } = await setup();
    
    await listener.onMessage(order, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket?.orderId).not.toBeDefined();

});

it('should publishes ticket updated event', async () => {
    const { data: order, listener, msg, ticket } = await setup();
    
    await listener.onMessage(order, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    console.log(ticketUpdatedData);

    expect(ticketUpdatedData.id).toEqual(ticket.id);

});

it('should acks the message', async () => {
    const { data: order, listener, msg, ticket } = await setup();
    
    await listener.onMessage(order, msg);

    expect(msg.ack).toHaveBeenCalled();
});