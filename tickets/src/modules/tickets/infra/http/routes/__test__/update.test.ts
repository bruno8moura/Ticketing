import { Mongoose } from 'mongoose';
import request from 'supertest';
import { app } from '../../../../../../app';
import { Ticket } from '../../../mongoose/entities/Ticket';
import mongoose from 'mongoose';

interface UpdateTicket {
    title: string;
    price: number;
}

describe( 'UpdateTickets', () => {
    it( 'should returns a 404 if the provided id does not exist', async () => {
        const id = 'notExist';
        const updateATicket: UpdateTicket = {
            title: 'title1',
            price: 10
        };

        await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send(updateATicket)
        .expect(404);
    } );

    it( 'should returns a 401 if the user is not authenticated', async () => {
        const id = 'notExist';
        const updateATicket: UpdateTicket = {
            title: 'title1',
            price: 10
        };

        await request(app)
        .put(`/api/tickets/${id}`)
        .send(updateATicket)
        .expect(401);
    } );

    it( 'should returns a 401 if the user does not own the ticket', async () => {
        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'adfasdf',
            price: 20
        });

        const { ticket } = response.body;
        await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'wetwretwrt',
            price: 1000
        })
        .expect(401);

    } );

    it( 'should returns a 400 if the user provides an invalid title or price', async () => {

        const cookie = global.signin();

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'asdfadsfa',
            price: 10
        });

        const { ticket } = response.body;
        const updateResponse = await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 0
        });

        expect(updateResponse.status).toEqual(400);
    } );

    it( 'should return 200 in order to update the ticket provided with valid inputs', async () => {
        const cookie = global.signin();

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'asdfadsfa',
            price: 10
        });

        const { ticket } = response.body;
        const updateResponse = await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'A valid title',
            price: 1000
        });

        expect(updateResponse.status).toEqual(200);

        const getResponse = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie)
        .send();

        expect(getResponse.body.ticket.title).toEqual('A valid title');
        expect(getResponse.body.ticket.price).toEqual(1000);
    } );

    it('should returns 400 in order to reject updates if the ticket is reserved', async () => {
        const cookie = global.signin();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asldkfj',
            price: 20
        });
        
        const ticket = await Ticket.findById(response.body.ticket.id);
        ticket?.set({orderId: mongoose.Types.ObjectId().toHexString() });
        await ticket?.save();

        await request(app)
        .put(`/api/tickets/${response.body.ticket.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);
    });
} );