import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/ExpirationCompletePublisher';
import { natsWrapper } from '../infra/clients/NATSStreamServer/NATSWrapper';
import { setLocalTimezone } from '@bcmtickets/common';

interface IPayload {
    orderId: string;
}

const expirationQueue = new Queue<IPayload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async job => {    
    const now = new Date();
    setLocalTimezone(now);
    console.log('now: ', now);
    //console.log('job: ', job);
    
    
    console.log( `id: ${job.id}` );    
    console.log( 'I want to publish an expiration:complete event for orderId', job.data.orderId );
    const { orderId } = job.data;
    new ExpirationCompletePublisher(natsWrapper.client).publish( { orderId } );
    
});

export { expirationQueue };