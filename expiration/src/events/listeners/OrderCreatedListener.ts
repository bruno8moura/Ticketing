import { Listener, OrderCreatedEvent, OrderDTO, Subjects } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupsName } from "./QueueGroupNames";
import { expirationQueue } from '../../queues/ExpirationQueue';
import { setLocalTimezone } from '@bcmtickets/common';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupsName.expiration;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const now = setLocalTimezone(new Date());

        const dateFromOrderCreated = new Date(data.expiresAt);

        const delay = dateFromOrderCreated.getTime() - now.getTime();
        console.log('Waiting this many miliseconds to process the job:', now, dateFromOrderCreated, delay);
        
        await expirationQueue.add({
            orderId: data.id
        },
        {
            delay: delay
        }
        );
        msg.ack();
    }
}