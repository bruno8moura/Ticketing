import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../modules/orders/infra/mongoose/entities/Order";
import { queueGroupsName } from './QueueGroupNames';

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupsName.order;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, orderId, thridPartyPaymentId } = data;
        const order = await Order.findById(orderId);

        if(!order) {
            throw new Error('Order not found');
        }

        // TODO We have to let the other services know about this change
        order.set( { 
            status: OrderStatus.Complete 
        } );
        await order.save();
        
        msg.ack();
    }
}