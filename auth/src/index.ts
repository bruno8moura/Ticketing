import 'express-async-errors';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import currentUserRouter from './modules/user/infra/http/routes/currentuser.routes';
import signinRouter from './modules/user/infra/http/routes/signin.routes';
import signoutRouter from './modules/user/infra/http/routes/signout.routes';
import signUpRouter from './modules/user/infra/http/routes/signup.routes';
import errorHandler from "./shared/middlerwares/errors";
import NotFoundError from './shared/errors/NotFoundError';
import DatabaseError from './shared/errors/DatabaseError';

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
    } catch (e) {
        throw new DatabaseError(`Cannot connect to database: ${e.message}`);
    }
}

start();

export default app;