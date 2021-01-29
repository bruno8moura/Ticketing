import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './infra/eventbus/implementation/TicketCreatedListener';

console.clear();
console.log('pid: ', process.pid);

const CLIENT_ID = TicketCreatedListener.name + '-' + randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', CLIENT_ID, {
    url: 'https://localhost:4222'
});

stan.on('connect', () => {
    const listener = new TicketCreatedListener(stan);
    console.log(`Listener "${CLIENT_ID}" connected to NATS`);

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();        
    });

    listener.listen();
});

process.on('SIGINT', () => {
    console.log('SIGINT');
    stan.close();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    stan.close();
});