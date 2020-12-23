import request from 'supertest';
import { app } from '../../../../../../app';

it('return 201 on successful singup', async () => {
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: 'password'
    })
    .expect(201);
});

it('return 400 - invalid email', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test',
        password: 'password'
    })
    .expect(400);
});

it('return 400 - Password is required', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com'
    })
    .expect(400);
});

it('return 400 - Password has less than 4(3) character ', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: 'p'
    })
    .expect(400);
});

it('return 400 - Password has more than 20(21) characters', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: 'passwordaapasswordaaa'
    })
    .expect(400);
});

it('Disallows duplicate emails', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: '12345'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@mail.com',
        password: '12345'
    })
    .expect(400);
});
