import { Router, Request, Response } from 'express';
import { index } from '../controllers/CurrentUserController';

const router = Router();

router.get('/api/users/currentuser', index);

export default router;