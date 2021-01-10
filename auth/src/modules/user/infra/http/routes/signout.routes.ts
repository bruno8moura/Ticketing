import { Router } from "express";

const router = Router();
import { signOut } from '../controllers/SignOutController';

router.delete('/api/users/signout', signOut);

export default router;