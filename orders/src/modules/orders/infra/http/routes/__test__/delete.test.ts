import request from 'supertest';
import { uuid } from 'uuidv4';
import { app } from '../../../../../../app';
import { natsWrapper } from '../../../../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import { Order, OrderStatus } from '../../../mongoose/entities/Order';
import { Ticket, TicketDoc } from '../../../mongoose/entities/Ticket';

const buildTicket = async (title: string, price: number): Promise<TicketDoc> => {
    const ticket = Ticket.build({
        id: uuid(),
        title,
        price
    });

    await ticket.save();

    return ticket;
};

describe('Delete orders', () => {    

    it('should mark an order as cancelled', async () => {
        
        // Create a ticket
        const ticket = await buildTicket('A new ticket 1', 10);
        const user = global.signin();

        // Create one order
        const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);

        // Delete an order
        await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

        const updatedOrder = await Order.findById(order.id);

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('emits an order cancelled event', async () => {
        // Create a ticket
        const ticket = await buildTicket('A new ticket 1', 10);
        const user = global.signin();

        // Create one order
        const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);

        // Delete an order
        await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

        const updatedOrder = await Order.findById(order.id);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    })
});