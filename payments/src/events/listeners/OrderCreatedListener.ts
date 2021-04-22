import { Listener, OrderCreatedEvent, OrderDTO, Subjects } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from '../../modules/payments/infra/mongoose/entities/Order';
import { queueGroupsName } from "./QueueGroupNames";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupsName.ticket;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        // Ack the message
        msg.ack();
    }

}