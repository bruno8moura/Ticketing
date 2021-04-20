import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, setLocalTimezone, ExpirationCompleteEvent } from '@bcmtickets/common';
import ExpirationCompleteListener from '../ExpirationCompleteListener';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import { Order } from '../../../modules/orders/infra/mongoose/entities/Order';
import { Ticket } from '../../../modules/orders/infra/mongoose/entities/Ticket';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdlfjasd',
        expiresAt: setLocalTimezone(new Date()),
        ticket,
    });

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id!
    };
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, ticket, data, msg };
};

it('should not find the Order', async () => {
    const { listener, msg } = await setup();

    expect(listener.onMessage({orderId: mongoose.Types.ObjectId().toHexString()}, msg)).rejects.toBeInstanceOf(Error);
});

it('should the Order Status to cancelled', async () => {
    const { listener, data, order, ticket, msg } = await setup();
    await listener.onMessage( data, msg );

    const orderCancelled = await Order.findById(order.id);

    expect(orderCancelled!.status).toEqual(OrderStatus.Cancelled);
});

it('should emit an OrderCancelled event', async () => {
    const { listener, data, order, ticket, msg } = await setup();
    await listener.onMessage( data, msg );

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage( data, msg ); 

    expect(msg.ack).toHaveBeenCalled();
});