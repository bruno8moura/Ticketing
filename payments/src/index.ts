import { app } from './app';
import { JwtSecretNotDefinedError, DatabaseError, StreamingServerError } from '@bcmtickets/common';
import { JWT_KEY, PORT, STRIPE_KEY } from './env_variables';
import { connect as connectToMongoDB } from './shared/infra/connect/mongodb';
import { connect as connectToNATSStreamServer } from './shared/infra/connect/nats';
import { listenEvents } from './shared/infra/StreamServerListeners';

const start = async () => {    
    if(!JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }
    
    if(!STRIPE_KEY){
        throw new Error('STRIPE_KEY must be defined');
    }

    await connectToMongoDB();
    await connectToNATSStreamServer();
    await listenEvents();

    app.listen(PORT, () => {
        console.log('Listening on port ', PORT);
    });
};

start();

export default app;