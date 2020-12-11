import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import currentUserRouter from './modules/currentuser/routes';
import signinRouter from './modules/signin/routes';
import signoutRouter from './modules/signout/routes';
import signUpRouter from './modules/signup/routes';
import errorHandler from "./shared/middlerwares/errors";
import NotFoundError from './shared/errors/NotFoundError';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signUpRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
        app.listen(3000, () => {
            console.log('Listening on port 3000!');
        });
    } catch (error) {
        console.error(error);
    }
}

start();

export default app;