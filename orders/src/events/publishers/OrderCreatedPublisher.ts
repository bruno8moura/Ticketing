import { Publisher, OrderCreatedEvent, Subjects } from '@bcmtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}