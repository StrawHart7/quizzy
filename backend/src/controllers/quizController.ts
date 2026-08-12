import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dataService from '../services/dataService';
import { Quiz } from '../types';

export const quizController = {
  // Get all quizzes
  getAll: (req: Request, res: Response) => {
    try {
      const quizzes = dataService.getQuizzes();
      res.json({ success: true, data: quizzes });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des quiz' });
    }
  },

  // Get single quiz
  getOne: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const quiz = dataService.getQuiz(id);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz non trouvé' });
      }
      res.json({ success: true, data: quiz });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération du quiz' });
    }
  },

  // Create quiz
  create: (req: Request, res: Response) => {
    try {
      const { title, description, category, difficulty, timeLimit, questions } = req.body;
      
      const newQuiz: Quiz = {
        id: uuidv4(),
        title,
        description,
        category,
        difficulty: difficulty || 'facile',
        timeLimit: timeLimit || 300,
        questions: questions || [],
        createdBy: req.user?.id || 'admin',
        createdAt: new Date()
      };

      const created = dataService.addQuiz(newQuiz);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la création du quiz' });
    }
  },

  // Update quiz
  update: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updated = dataService.updateQuiz(id, updateData);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Quiz non trouvé' });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du quiz' });
    }
  },

  // Delete quiz
  delete: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = dataService.deleteQuiz(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Quiz non trouvé' });
      }
      res.json({ success: true, message: 'Quiz supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression du quiz' });
    }
  }
};