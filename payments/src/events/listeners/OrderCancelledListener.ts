import { Listener, OrderCancelledEvent, OrderDTO, OrderStatus, Subjects } from '@bcmtickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../modules/payments/infra/mongoose/entities/Order';
import { queueGroupsName } from './QueueGroupNames';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupsName.ticket;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const foundOrder = await Order.findOne({
            _id: data.id,
            version: data.version -1
        });

        if(!foundOrder) {
            throw new Error('Order not found');
        }

        foundOrder.set({
            status: OrderStatus.Cancelled
        });

        await foundOrder.save();

        // Ack the message
        msg.ack();
    }    
}