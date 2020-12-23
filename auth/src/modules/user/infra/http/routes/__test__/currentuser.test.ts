import request from 'supertest';
import { app } from '../../../../../../app';

it('Responde with details about the current user', async () => {
    const userLoggedIn = await global.signin();
    const cookie = userLoggedIn.cookie;

    const response = await request(app)
    .get('/api/users/currentuser')    
    .set('Cookie', cookie)
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test@mail.com')
});

it('Responds with 401 if not authenticated', async () => {
    await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);
});