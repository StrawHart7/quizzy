import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dataService from '../services/dataService';

export const questionController = {
  // Add question to quiz
  add: (req: Request, res: Response) => {
    try {
      const { quizId } = req.params;
      const { type, text, options, correctAnswer, explanation, difficulty, points } = req.body;

      const newQuestion = {
        id: uuidv4(),
        type: type || 'unique',
        text,
        options: options || [],
        correctAnswer,
        explanation: explanation || '',
        difficulty: difficulty || 'facile',
        points: points || 10
      };

      const updatedQuiz = dataService.addQuestion(quizId, newQuestion);
      if (!updatedQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz non trouvé' });
      }
      res.status(201).json({ success: true, data: updatedQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la question' });
    }
  },

  // Update question
  update: (req: Request, res: Response) => {
    try {
      const { quizId, questionId } = req.params;
      const updateData = req.body;

      const updatedQuiz = dataService.updateQuestion(quizId, questionId, updateData);
      if (!updatedQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz ou question non trouvé' });
      }
      res.json({ success: true, data: updatedQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la question' });
    }
  },

  // Delete question
  delete: (req: Request, res: Response) => {
    try {
      const { quizId, questionId } = req.params;

      const updatedQuiz = dataService.deleteQuestion(quizId, questionId);
      if (!updatedQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz ou question non trouvé' });
      }
      res.json({ success: true, data: updatedQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la question' });
    }
  }
};