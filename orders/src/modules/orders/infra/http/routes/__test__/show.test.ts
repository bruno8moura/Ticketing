import request from 'supertest';
import { uuid } from 'uuidv4';
import { app } from '../../../../../../app';
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

describe('List orders', () => {
    it('should fetches the order', async () => {
        
        // Create a ticket
        const ticket = await buildTicket('A new ticket 1', 10);
        const user = global.signin();

        // Create one order
        const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);

        // Make request to get the order
        const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

        expect(fetchedOrder.id).toEqual(order.id);
    });

    it('should returns an error if one user tries to fetch another users order', async () => {
        
        // Create a ticket
        const ticket = await buildTicket('A new ticket 1', 10);
        const user = global.signin();

        // Create one order
        const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);

        const user2 = global.signin();
        // Make request to get the order
        const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401);
    });
    
    it('should not retrieve nothing without a logged user', async () => {
        await request(app)
        .get('/api/orders')
        .set('Cookie', '')
        .send({})
        .expect(401)
    });
});