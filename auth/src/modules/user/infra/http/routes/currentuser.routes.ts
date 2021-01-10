import { Router } from 'express';
import { index } from '../controllers/CurrentUserController';
import { currentUser } from '@bcmtickets/common';

const router = Router();

router.get('/api/users/currentuser', currentUser, index);

export default router;