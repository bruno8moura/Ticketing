import { Router } from 'express';
import { signUpValidations, create } from '../controllers/SignUpController';
import { requestValidation } from '@bcmtickets/common';

const router = Router();

router.post('/api/users/signup', signUpValidations, requestValidation, create);

export default router;