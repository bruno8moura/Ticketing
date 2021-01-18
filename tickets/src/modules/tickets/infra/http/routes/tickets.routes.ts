import { Router } from 'express';
import { createTicketValidations, create, show, index, update } from '../controllers/TicketsController';
import { requestValidation, auth } from '@bcmtickets/common';

const router = Router();

router.post('/', auth, createTicketValidations, requestValidation,  create);
router.get('/:id', auth, show);
router.get('/', auth, index);
router.put('/:id', auth, createTicketValidations, requestValidation, update);

export default router;