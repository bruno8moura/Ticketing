import request from 'supertest';
import { app } from '../app';

interface User {
    email: string;
    id: string;
}

export interface UserLoggedIn{
    cookie: string[];
    user: User;    
}

declare global {
    namespace NodeJS {
        interface Global{
            signin(): Promise<UserLoggedIn>;
        }
    }
}

global.signin = async (): Promise<UserLoggedIn> => {
    const email = 'test@mail.com';
    const password = 'password';

    const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
        email,
        password
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email,
        password
    })
    .expect(200);

    return {cookie: response.get('Set-Cookie'), user: {id: signupResponse.body.id, email: signupResponse.body.email}};
};