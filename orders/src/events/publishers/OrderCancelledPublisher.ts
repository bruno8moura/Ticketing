import { Publisher, OrderCancelledEvent, Subjects } from "@bcmtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}