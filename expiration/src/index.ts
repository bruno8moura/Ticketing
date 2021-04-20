import { StreamingServerError } from '@bcmtickets/common';
import { PORT } from './env_variables';
import { connect as connectToNATSStreamServer } from './infra/connect/nats';
import listen from './infra/connect/nats/listeners';

const start = async () => {
    
    await connectToNATSStreamServer();
    listen();
};

start();