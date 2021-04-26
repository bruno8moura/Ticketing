import { Router, Request, Response, NextFunction } from 'express';
import { create, createPaymentsValidations } from '../controllers/PaymentsController';
import { requestValidation, auth } from '@bcmtickets/common';

const router = Router();

router.post('/', auth, createPaymentsValidations, requestValidation, create);

export default router;