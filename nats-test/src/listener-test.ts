import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
console.log('pid: ', process.pid);

const CLIENT_ID = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', CLIENT_ID, {
    url: 'https://localhost:4222'
});

stan.on('connect', () => {
    console.log(`Listener "${CLIENT_ID}" connected to NATS`);

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();        
    });

    const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)    
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');

    const subscription = stan.subscribe(
                                'ticket:created', 
                                'order-service-queue-group',
                                options);
    
    subscription.on('message', (msg: Message) => {

        const data = msg.getData();
        

        if(typeof data === 'string'){
            console.log(`Received event #${msg.getSequence()} at ${new Date()}, with data: ${data}`);
        }
        msg.ack();        
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT');
    stan.close();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    stan.close();
});