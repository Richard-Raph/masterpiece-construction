// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, logout } from '../controllers/Auth';

const router = Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// POST /auth/logout
router.post('/logout', logout);

export default router;