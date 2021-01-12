import { Router } from 'express';
import { createTicketValidations, create } from '../controllers/TicketsController';
import { requestValidation, auth } from '@bcmtickets/common';

const router = Router();

router.post('/', auth, createTicketValidations, requestValidation,  create);

export default router;