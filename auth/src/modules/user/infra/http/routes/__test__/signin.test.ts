import request from 'supertest';
import { app } from '../../../../../../app';

it('Sets a cookie after successful signup', async () => {
    const userLoggedIn = await global.signin();
    expect(userLoggedIn.cookie).toBeDefined();
});

it('Fails when a email that does not exist is supplied', async () => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@mail.com',
        password: '12345'
    })
    .expect(400);    
});

it('Fails when a incorrect password is supplied', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: '12345'
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@mail.com',
        password: '123456'
    })
    .expect(400);
});