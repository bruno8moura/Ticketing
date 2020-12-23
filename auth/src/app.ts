import 'express-async-errors';
import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import currentUserRouter from './modules/user/infra/http/routes/currentuser.routes';
import signinRouter from './modules/user/infra/http/routes/signin.routes';
import signoutRouter from './modules/user/infra/http/routes/signout.routes';
import signUpRouter from './modules/user/infra/http/routes/signup.routes';
import errorHandler from "./shared/middlerwares/errors";
import NotFoundError from './shared/errors/NotFoundError';

const app = express();
app.set('trust proxy', true); // tell to express that it is behind a trusted proxy
app.use(json());
app.use(
    cookieSession({
       signed: false, // the cookie won't be encrypted
       secure: process.env.NODE_ENV !== 'test',  // use cookies only with https connection
    })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signUpRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };