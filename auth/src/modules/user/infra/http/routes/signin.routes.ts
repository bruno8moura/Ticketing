import { Router } from 'express';
import { signInValidations, create } from '../controllers/SignInController';
import { requestValidation } from '../../../../../shared/middlerwares/requestValidation';

const router = Router();

router.post('/api/users/signin', signInValidations, requestValidation, create);

export default router;