import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects, TicketUpdatedEvent } from "@bcmtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../modules/orders/infra/mongoose/entities/Order";
import { natsWrapper } from "../../shared/infra/clients/NATSStreamServer/NATSWrapper";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";
import { queueGroupsName } from './QueueGroupNames';

export default class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupsName.order;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate('ticket');

        if(!order) {
            throw new Error('Order not found');
        }

        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set( { 
            status: OrderStatus.Cancelled,
        } );
        await order.save();

        /*
            Here we could use the database feature 'transaction' in order to uncouple this dependency.
            The way it is we are assuming that always the comunication with nats will happen successfully.
        */ 

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            expiresAt: order.expiresAt.toUTCString(),
            id: order.id!,
            status: order.status,
            userId: order.userId,
            version: order.version,
            ticket: { // actually, only ticket.id is needed here.
                id: order.ticket.id!,
                price: order.ticket.price,
                title: order.ticket.title,
                version: order.ticket.version,
                orderId: order.id,
                userId: 'none'
            }
        });

        msg.ack();
    }    
}