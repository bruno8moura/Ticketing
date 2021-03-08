import { Ticket } from '../infra/mongoose/entities/Ticket';
import { Order, OrderDoc } from '../infra/mongoose/entities/Order';
import { NotFoundError, OrderStatus, BadRequestError } from '@bcmtickets/common';
import OrderDTO from '../../dtos/OrderDTO';
import { EXPIRATION_WINDOW_SECONDS } from '../../../env_variables';

interface IRequest {
    ticketId: string;
    userId: string;
}

export default class CreateOrderService{
    public async execute({ ticketId, userId }: IRequest): Promise<OrderDTO> {
        const ticket = await Ticket.findById(ticketId);

        if(!ticket){
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        const isReserved = await ticket.isReserved();
        if(isReserved){
            throw new BadRequestError('Ticket is already reserved.');
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + eval(EXPIRATION_WINDOW_SECONDS));

        // Build the order and save it to the database
        const order = Order.build({
            userId,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();

        // TODO - Publish an event saying that an order was created

        return {
            id: order.id!,
            userId: order.userId,
            expiresAt: order.expiresAt,
            status: order.status,
            ticket: {
                id: ticket.id!,
                title: ticket.title,
                price: ticket.price
            }
        };
    }
}