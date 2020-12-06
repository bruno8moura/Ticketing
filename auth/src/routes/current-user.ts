import express, { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/users/currentuser', (request: Request, response: Response) => response.status(200).send('Hi there!!!'));

export { router as currentUserRouter};