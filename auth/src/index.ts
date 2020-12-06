import express, { Request, Response } from "express";
import { json } from "body-parser";

import {currentUserRouter} from "./routes/current-user";
import {signinRouter} from "./routes/signin";
import {signoutRouter} from "./routes/signout";
import {signUpRouter} from "./routes/signup";

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

export default app;