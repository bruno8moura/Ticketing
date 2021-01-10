import { app } from './app';
import mongoose from 'mongoose';
import { JwtSecretNotDefinedError } from '@bcmtickets/common';
import { DatabaseError } from '@bcmtickets/common';

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('Listening on port ', PORT);
        });
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }
};

start();

export default app;