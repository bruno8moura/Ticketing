import { OrderCancelledEvent, OrderStatus } from "@bcmtickets/common";
import mongoose from 'mongoose';
import { Order } from "../../../modules/payments/infra/mongoose/entities/Order";
import { natsWrapper } from "../../../shared/infra/clients/NATSStreamServer/NATSWrapper";
import { OrderCancelledListener } from "../OrderCancelledListener";
import OrderCreatedListener from "../OrderCreatedListener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'adfa',
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        status: OrderStatus.Created,
        expiresAt: 'asdfasdf',
        userId: 'adfasdf',
        ticket: {
            id: 'asdf',
            price: 10,
            title: 'title1',
            userId: 'adfasdf',
            version: 1,
            orderId: 'asdfasdf'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order };
};

it('should updates the status of the order', async () => {
    const {data, listener, msg, order} = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should acks the message', async () => {
    const {data, listener, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});