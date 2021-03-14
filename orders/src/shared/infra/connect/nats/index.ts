import { StreamingServerError } from '@bcmtickets/common';
import { NATS_CLIENT_ID, NATS_CLUSTER_ID, NATS_URL } from '../../../../env_variables';
import { natsWrapper } from '../../clients/NATSStreamServer/NATSWrapper';
import TicketCreatedListener from '../../../../events/listeners/TicketCreatedListener';
import TicketUpdatedListener from '../../../../events/listeners/TicketUpdatedListener';

export const connect = async () => {
    try {

        if(!NATS_CLUSTER_ID){
            throw new Error('NATS_CLUSTER_ID must be defined');
        }
    
        if(!NATS_URL){
            throw new Error('NATS_URL must be defined');
        }
    
        if(!NATS_CLIENT_ID){
            throw new Error('NATS_CLIENT_ID must be defined');
        }

        await natsWrapper.connect({
            clusterId: NATS_CLUSTER_ID, 
            clientId: NATS_CLIENT_ID, 
            url: NATS_URL
        });

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();       
        })

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

    } catch (e) {
        throw new StreamingServerError(`Cannot connect to NATS Streaming Server: ${e.message}`);
    }
};
