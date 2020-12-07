import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import currentUserRouter from './modules/currentuser/routes';
import signinRouter from './modules/signin/routes';
import signoutRouter from './modules/signout/routes';
import signUpRouter from './modules/signup/routes';
import errorHandler from "./shared/middlerwares/errors";
import NotFoundError from './shared/errors/NotFoundError';

const app = express();
app.use(json());

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});

app.get('/', (request: Request, response: Response) => response.status(200).json({ok: true}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signUpRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;