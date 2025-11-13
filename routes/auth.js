import express from 'express';
import { register, login, profile } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// User registration
router.post('/registro', register);

// Login
router.post('/login', login);

// Get profile
router.get('/perfil', auth, profile);

export default router;
