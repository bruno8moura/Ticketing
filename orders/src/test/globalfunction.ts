import { JWT_KEY } from '../env_variables';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

interface User {
    email: string;
    id: string;
}

declare global {
    namespace NodeJS {
        interface Global{
            signin(): string[];
        }
    }
}

// Tell jest to use our mock file(__mock__) instead use the real NATS client.
// Tell jest which file we want to fake.
jest.mock('../shared/infra/clients/NATSStreamServer/NATSWrapper');

global.signin = (): string[] => {
    // Build JWT payload. { id, email }
    const payload: User = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@mail.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, JWT_KEY!);

    // Build session JSON Object. { jwt: MY-JWT }
    const session = { jwt: token };

    // Turn that session JSON Object into string
    const sessionJSON = JSON.stringify(session);

    // Take JSON string and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
};