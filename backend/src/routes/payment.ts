import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import expressRaw from 'express';

const router = express.Router();

// Routes protégées
router.post('/create-transaction', authenticate, paymentController.createTransaction);
router.get('/verify/:token', authenticate, paymentController.verifyTransaction);
router.get('/teacher-status', authenticate, paymentController.getTeacherStatus);

// Webhook (route publique, sans auth, avec body raw)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

export default router;