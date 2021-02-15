import mongoose from 'mongoose';
import { DatabaseError } from '@bcmtickets/common';
import { MONGO_URI } from '../../../../env_variables';

export const connect = async () => {
    try {
        
        if(!MONGO_URI){
            throw new Error('MONGO_URI must be defined');
        }

        await mongoose.connect( MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }
}
