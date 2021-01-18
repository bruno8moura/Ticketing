import { app } from './app';
import mongoose from 'mongoose';
import { JwtSecretNotDefinedError } from '@bcmtickets/common';
import { DatabaseError } from '@bcmtickets/common';

const start = async () => {
    const [ JWT_KEY, MONGO_URI ] = [ process.env.JWT_KEY, process.env.MONGO_URI ];

    if(!JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

    if(!MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    try {
        console.log(MONGO_URI);
        
        await mongoose.connect( MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('Listening on port ', PORT);
        });
    } catch (e) {
        console.log(e.message);
        
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }
};

start();

export default app;