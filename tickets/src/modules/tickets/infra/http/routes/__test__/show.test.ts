import request from 'supertest';
import { app } from '../../../../../../app';

describe( 'QueryATicket', () => {
    it( 'returns a 404 if the ticket is not found', async () => {
        const id = 'asdasd1';
        await request(app)
        .get(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404);
    } );

    it( 'returns the ticket if the ticket is found', async () => {
        const newTitle = 'adfasdf';
        const newPrice = 20;
        
        const { body: { ticket } } = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(201);

        const { body: { ticket: foundTicket } } = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set('Cookie', global.signin())
        .send()
        expect(200);

        expect(foundTicket.title).toEqual(newTitle);
        expect(foundTicket.price).toEqual(newPrice);
    } );
} );