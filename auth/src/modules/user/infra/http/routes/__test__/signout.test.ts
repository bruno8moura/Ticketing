import request from 'supertest';
import { app } from '../../../../../../app';

it('Clears the cookie after signing out', async () => {
    const userLoggedIn = await global.signin();

    const response = await request(app)
    .delete('/api/users/signout')
    .set('Cookie', userLoggedIn.cookie)
    .expect(200);
    const cookie = response.get('Set-Cookie')[0].split(';')[0].split('express:sess=')[1]
    
    expect(cookie).toEqual('');
});