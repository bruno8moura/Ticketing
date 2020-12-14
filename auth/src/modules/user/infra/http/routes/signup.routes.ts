import express, { Request, Response, Router  } from "express";
import signUpController, { signUpValidations }  from "../controllers/SignUpController";

const router = Router();

router.post('/api/users/signup', signUpValidations, signUpController);

export default router;