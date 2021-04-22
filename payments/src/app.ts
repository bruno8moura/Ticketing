import 'express-async-errors';
import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@bcmtickets/common';

import routes from './shared/infra/http/routes';

const app = express();
app.set('trust proxy', true); // tell to express that it is behind a trusted proxy
app.use(json());
app.use(
    cookieSession({
       signed: false, // the cookie won't be encrypted
       secure: process.env.NODE_ENV !== 'test',  // use cookies only with https connection
    })
)
app.use(currentUser);

app.use(routes);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };