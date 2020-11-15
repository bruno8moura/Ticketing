import express, { Request, Response } from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});

app.get('/', (request: Request, response: Response) => response.status(200).json({ok: true}));
app.get('/api/users/currentuser', (request: Request, response: Response) => response.status(200).send('Hi there!!!'));

export default app;