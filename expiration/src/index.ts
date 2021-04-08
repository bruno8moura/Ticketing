import { StreamingServerError } from '@bcmtickets/common';
import { PORT } from './env_variables';
import { connect as connectToNATSStreamServer } from './infra/connect/nats';

const start = async () => {
    
    await connectToNATSStreamServer();
};

start();