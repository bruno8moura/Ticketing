import 'express-async-errors';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import currentUserRouter from './modules/user/infra/http/routes/currentuser.routes';
import signinRouter from './modules/user/infra/http/routes/signin.routes';
import signoutRouter from './modules/user/infra/http/routes/signout.routes';
import signUpRouter from './modules/user/infra/http/routes/signup.routes';
import errorHandler from "./shared/middlerwares/errors";
import NotFoundError from './shared/errors/NotFoundError';
import DatabaseError from './shared/errors/DatabaseError';
import JwtSecretNotDefinedError from './shared/errors/JwtSecretNotDefinedError';

const app = express();
app.set('trust proxy', true); // tell to express that it is behind a trusted proxy
app.use(json());
app.use(
    cookieSession({
       signed: false, // the cookie won't be encripted
       secure: true,  // use cookies only with https connection
    })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signUpRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new JwtSecretNotDefinedError();
    }

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