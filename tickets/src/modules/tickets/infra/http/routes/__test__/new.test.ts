import request from 'supertest';
import { app } from '../../../../../../app';
import '../../../../../../test/globalfunction';
import TicketRepository from '../../../mongoose/repositories/TicketRepository';

//invoke the mock instead of the real object NATS
import { natsWrapper } from '../../../../../../shared/infra/clients/NATSStreamServer/NATSWrapper';

describe( 'CreateTicket', () => {
    it( 'has a route handler listening to /api/tickets for post requests', async () => {
        const response = await request(app)
        .post('/api/tickets')
        .send({});

        expect(response.status).not.toEqual(404);
    } );

    it( 'can only be accessed if the user is signed in', async () => {
        const response = await request(app)
        .post('/api/tickets')
        .send({});
        
        expect(response.status).toEqual(401);
    } );

    it( 'returns a status other than 401 if the user is signed in', async () => {
        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

        expect(response.status).not.toEqual(401);
    } );

    it( 'returns an error if an invalid title is provided', async () => {
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);
    } );

    it( 'returns an error if an invalid price is provided', async () => {
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'adsfasdfasdf',
            price: -10
        })
        .expect(400);

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'adsfasdfasdf',
        })
        .expect(400);
    } );

    it( 'creates a ticket with valid inputs', async () => {
        const title = 'adfasdf';
        const price = 20;
        
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);

        const foundTickets = await new TicketRepository().find({title, price});
        expect(foundTickets.length).toEqual(1);
        expect(foundTickets[0].title).toEqual(title);
        expect(foundTickets[0].price).toEqual(price);
    } );
    
    it('publishes an event', async () => {
        const title = 'adfasdf';
        const price = 20;
        
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);

        const publish = jest.spyOn(natsWrapper.client, 'publish');
        
        expect(publish).toHaveBeenCalled();    
        
    });
} );