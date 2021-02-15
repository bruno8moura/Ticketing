import { app } from './app';
import mongoose from 'mongoose';
import { JwtSecretNotDefinedError, DatabaseError, StreamingServerError } from '@bcmtickets/common';
import { natsWrapper } from './shared/infra/clients/NATSStreamServer/NATSWrapper';
import { variable } from './env_variables';

const start = async () => {    
    if(!variable.JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

    if(!variable.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    if(!variable.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if(!variable.NATS_URL){
        throw new Error('NATS_URL must be defined');
    }

    if(!variable.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        await natsWrapper.connect({
            clusterId: variable.NATS_CLUSTER_ID, 
            clientId: variable.NATS_CLIENT_ID, 
            url: variable.NATS_URL
        });

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();       
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

    } catch (e) {
        throw new StreamingServerError(`Cannot connect to NATS Streaming Server: ${e.message}`);
    }

    try {
        await mongoose.connect( variable.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }

    app.listen(variable.PORT, () => {
        console.log('Listening on port ', variable.PORT);
    });
};

start();

export default app;