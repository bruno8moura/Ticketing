import { Router } from 'express';
import { index } from '../controllers/CurrentUserController';
import { currentUser } from '../../../../../shared/middlerwares/currentuser';
import { auth } from '../../../../../shared/middlerwares/auth';

const router = Router();

router.get('/api/users/currentuser', currentUser, auth, index);

export default router;