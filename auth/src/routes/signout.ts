import express, {Request, Response, Router  } from "express";

const router = Router();

router.post('/api/users/signout', (req, res) => {res.send('Logout!')});

export {router as signoutRouter};