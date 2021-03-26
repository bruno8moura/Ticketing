import { NotFoundError, NotAuthorizedError } from '@bcmtickets/common';
import OrderDTO from '../../dtos/OrderDTO';
import { Order, OrderDoc } from '../infra/mongoose/entities/Order';

interface IRequest {
    userId: string;
}

export default class ListOrderService{
    public async execute({ userId }: IRequest): Promise<OrderDTO[]> {

        if(!userId){
            throw new NotAuthorizedError();
        }

        const foundOrders = await Order.find({
            userId
        }).populate('ticket');  


        if(foundOrders === undefined || foundOrders.length === 0){
            throw new NotFoundError();
        }
        
        const orders = foundOrders.map((order: OrderDoc): OrderDTO => {
            
            return {
                id: order.id!,
                expiresAt: order.expiresAt,
                status: order.status,
                userId: order.userId,
                version: order.version,
                ticket: { 
                    id: order.ticket.id!, 
                    title: order.ticket.title, 
                    price: order.ticket.price,
                    version: order.ticket.version, 
                }
            };
        });

        return orders;
    }
}
