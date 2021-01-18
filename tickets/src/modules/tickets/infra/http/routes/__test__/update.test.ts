import request from 'supertest';
import { app } from '../../../../../../app';

interface UpdateTicket {
    title: string;
    price: number;
}

describe( 'UpdateTickets', () => {
    it( 'returns a 404 if the provided id does not exist', async () => {
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

    it( 'returns a 401 if the user is not authenticated', async () => {
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

    it( 'returns a 401 if the user does not own the ticket', async () => {
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

    it( 'returns a 400 if the user provides an invalid title or price', async () => {

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

    it( 'updates the ticket provided valid inputs', async () => {
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
} );