import express from 'express';
import { quizController } from '../controllers/quizController';
import { questionController } from '../controllers/questionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.get('/', quizController.getAll);
router.get('/:id', quizController.getOne);

// Routes protégées (admin)
router.post('/', authenticate, quizController.create);
router.put('/:id', authenticate, quizController.update);
router.delete('/:id', authenticate, quizController.delete);

// Routes pour les questions (protégées)
router.post('/:quizId/questions', authenticate, questionController.add);
router.put('/:quizId/questions/:questionId', authenticate, questionController.update);
router.delete('/:quizId/questions/:questionId', authenticate, questionController.delete);

export default router;