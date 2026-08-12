import express from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées (authentification requise)
router.get('/me', authenticate, authController.getMe);

// Routes pour les utilisateurs authentifiés (pas besoin d'être admin)
router.get('/users', authenticate, authController.getAllUsers); // <-- MODIFICATION : plus besoin d'être admin

// Routes admin uniquement
router.put('/users/:userId/role', authenticate, authController.updateUserRole);
router.delete('/users/:userId', authenticate, authController.deleteUser);
router.post('/users', authenticate, authController.createUser);

export default router;