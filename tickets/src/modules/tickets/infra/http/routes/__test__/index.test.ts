import request from 'supertest';
import { app } from '../../../../../../app';
import TicketDTO from '../../../../../dtos/TicketDTO';

interface CreateTicket {
    title: string;
    price: number;
}

interface ListTicketsRespose {
    body: {
        docs: TicketDTO[];
    }
}

const createTicket = async ({ price, title }: CreateTicket) => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title,
        price
    });
};


describe( 'ListTickets', () => {
    it('can fetch a list of tickets', async () => {
        await createTicket({title: 'title1', price: 10});
        await createTicket({title: 'title2', price: 20});
        await createTicket({title: 'title3', price: 30});

        const { body: { docs } }: ListTicketsRespose = await request(app)
        .get('/api/tickets')
        .set('Cookie', global.signin())
        .send()
        .expect(200);

        expect(docs.length).toEqual(3);
    });
});