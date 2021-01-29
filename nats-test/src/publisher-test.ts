import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './infra/eventbus/implementation/TicketCreatedPublisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'https://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    try {
        const publisher = new TicketCreatedPublisher(stan);
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20,
            userId: '123'
        });        
    } catch (error) {
        console.error(error);        
    }
});