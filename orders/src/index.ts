import { app } from './app';
import { JwtSecretNotDefinedError, DatabaseError, StreamingServerError, ExpirationTimeNotDefinedError } from '@bcmtickets/common';
import { JWT_KEY, PORT, EXPIRATION_WINDOW_SECONDS } from './env_variables';
import { connect as connectToMongoDB } from './shared/infra/connect/mongodb';
import { connect as connectToNATSStreamServer } from './shared/infra/connect/nats';

const start = async () => {    
    if(!JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

    if(!EXPIRATION_WINDOW_SECONDS || EXPIRATION_WINDOW_SECONDS === '0'){
        throw new ExpirationTimeNotDefinedError();
    }

    await connectToMongoDB();
    await connectToNATSStreamServer();

    app.listen(PORT, () => {
        console.log('Listening on port ', PORT);
    });
};

start();

export default app;