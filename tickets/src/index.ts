import { app } from './app';
import mongoose from 'mongoose';
import { JwtSecretNotDefinedError, DatabaseError, StreamingServerError } from '@bcmtickets/common';
import { natsWapper } from './shared/infra/clients/NATSStreamServer/NATSWrapper';

const start = async () => {
    const [ JWT_KEY, MONGO_URI ] = [ process.env.JWT_KEY, process.env.MONGO_URI ];

    if(!JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

    if(!MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    try {
        await natsWapper.connect({
            clusterId: 'ticketing', 
            clientId: 'CreateTicket', 
            url: 'https://nats-serv:4222'
        });

        natsWapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();       
        })

        process.on('SIGINT', () => natsWapper.client.close());
        process.on('SIGTERM', () => natsWapper.client.close());

    } catch (e) {
        throw new StreamingServerError(`Cannot connect to NATS Streaming Server: ${e.message}`);
    }

    try {
        await mongoose.connect( MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Listening on port ', PORT);
    });
};

start();

export default app;