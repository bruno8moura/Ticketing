import express, {Request, Response, Router  } from "express";

const router = Router();

router.post('/api/users/signin', (req, res) => {
    const { email, password } = req.body;

    res.send('Signin!');
});

export default router;