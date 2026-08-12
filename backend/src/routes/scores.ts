import express from 'express';
import { scoreController } from '../controllers/scoreController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Routes publiques avec auth optionnelle
router.post('/', optionalAuth, scoreController.save);

// Routes protégées
router.get('/user/:userId', authenticate, scoreController.getUserScores);
router.get('/me', authenticate, (req, res) => {
  req.params.userId = req.user?.id;
  scoreController.getUserScores(req, res);
});
router.get('/quiz/:quizId', scoreController.getQuizScores);
router.get('/', authenticate, scoreController.getAll);

export default router;