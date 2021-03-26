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
    it('should fetches orders for an particular user', async () => {
        
        const ticketOne = await buildTicket('A new ticket 1', 10);
        const ticketTwo = await buildTicket('A new ticket 2', 20);
        const ticketThree = await buildTicket('A new ticket 3', 30);
        
        const userOne = global.signin();
        const userTwo = global.signin();

        // Create one order as User #1
        await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id})
        .expect(201);

        // Create two orders as User #2
        const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id})
        .expect(201);

        const { body: order3 } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id})
        .expect(201);


        // Make request to get orders for User #2
        const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send({})
        .expect(200);

        const { docs } = response.body;
        
        expect(docs.length).toEqual(2);
        expect(docs[0].id).toEqual(order2.id);
        expect(docs[1].id).toEqual(order3.id);
        
        expect(docs[0].ticket.id).toEqual(ticketTwo.id);
        expect(docs[1].ticket.id).toEqual(ticketThree.id);
    });
    
    it('should not retrieve nothing without a logged user', async () => {
        await request(app)
        .get('/api/orders')
        .set('Cookie', '')
        .send({})
        .expect(401)
    });
});