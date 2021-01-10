import { Router } from 'express';
import { signInValidations, create } from '../controllers/SignInController';
import { requestValidation } from '@bcmtickets/common';

const router = Router();

router.post('/api/users/signin', signInValidations, requestValidation, create);

export default router;