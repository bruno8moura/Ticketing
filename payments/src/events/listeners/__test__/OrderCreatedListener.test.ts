import { OrderCreatedEvent, OrderStatus } from "@bcmtickets/common";
import mongoose from 'mongoose';
import { Order } from "../../../modules/payments/infra/mongoose/entities/Order";
import { natsWrapper } from "../../../shared/infra/clients/NATSStreamServer/NATSWrapper";
import OrderCreatedListener from "../OrderCreatedListener";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'asdfa',
        userId: 'adfa',
        status: OrderStatus.Created,
        ticket: {
            id: 'adsfadf',
            price: 10,
            title: 'title2223',
            userId: 'asdasd',
            version: 1,
            orderId: 'adfadsfadf'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('should replicates the order info', async () => {
    const {data, listener, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('should acks the message', async () => {
    const {data, listener, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});