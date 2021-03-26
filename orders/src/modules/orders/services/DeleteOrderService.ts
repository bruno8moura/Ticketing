import { NotFoundError, NotAuthorizedError, OrderStatus } from '@bcmtickets/common';
import { OrderCancelledPublisher } from '../../../events/publishers/OrderCancelledPublisher';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import OrderDTO from '../../dtos/OrderDTO';
import { Order } from '../infra/mongoose/entities/Order';

interface IRequest {
    orderId: string;
    userId: string;
}

export default class DeleteOrderService{
    public async execute({ orderId, userId }: IRequest): Promise<OrderDTO> {
        
        if(!userId){
            throw new NotAuthorizedError();
        }
        
        const order = await Order.findById(orderId).populate('ticket');

        if(!order){
            throw new NotFoundError();
        }

        if(order.userId != userId){
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        const cancelledOrder = {
            id: order.id!, 
            expiresAt: order.expiresAt, 
            status: order.status, 
            userId: order.userId,
            version: order.version,
            ticket: {
                id: order.ticket.id!,
                price: order.ticket.price,
                title: order.ticket.title,
                version: order.ticket.version
            } 
        };

        const publisher = new OrderCancelledPublisher(natsWrapper.client);        
        publisher.publish({
            id: cancelledOrder.id,
            status: cancelledOrder.status,
            userId: cancelledOrder.userId,
            expiresAt: cancelledOrder.expiresAt.toISOString(), //UTC time format(agnostic timezone)
            version: cancelledOrder.version,
            ticket: {
             id: cancelledOrder.ticket.id,
             price: cancelledOrder.ticket.price,
             title: cancelledOrder.ticket.title,
             userId: '',
             version: cancelledOrder.ticket.version
            }
        });        

        return cancelledOrder;
    }
}
