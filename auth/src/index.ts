import { app } from './app';
import mongoose from 'mongoose';
import JwtSecretNotDefinedError from './shared/errors/JwtSecretNotDefinedError';
import DatabaseError from './shared/errors/DatabaseError';

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
        
        app.listen(3000, () => {
            console.log('Listening on port 3000!');
        });
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }
};

start();

export default app;