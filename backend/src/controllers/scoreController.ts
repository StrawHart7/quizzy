import { Request, Response } from 'express';
import dataService from '../services/dataService';
import { Score } from '../types';

export const scoreController = {
  // Save score
  save: (req: Request, res: Response) => {
    try {
      const { quizId, answers, totalPoints, maxPoints, percentage, timeSpent } = req.body;
      const userId = req.user?.id || 'anonymous';

      console.log('Sauvegarde score pour utilisateur:', userId);

      const score: Score = {
        userId,
        quizId,
        answers: answers || [],
        totalPoints: totalPoints || 0,
        maxPoints: maxPoints || 0,
        percentage: percentage || 0,
        timeSpent: timeSpent || 0,
        startTime: new Date(Date.now() - (timeSpent || 0) * 1000),
        endTime: new Date()
      };

      const saved = dataService.saveScore(score);
      res.status(201).json({ success: true, data: saved });
    } catch (error) {
      console.error('Erreur saveScore:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la sauvegarde du score' });
    }
  },

  // Get user scores
  getUserScores: (req: Request, res: Response) => {
    try {
      const userId = req.params.userId || req.user?.id;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'ID utilisateur requis' });
      }
      const scores = dataService.getScoresByUser(userId);
      res.json({ success: true, data: scores });
    } catch (error) {
      console.error('Erreur getUserScores:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des scores' });
    }
  },

  // Get quiz scores
  getQuizScores: (req: Request, res: Response) => {
    try {
      const { quizId } = req.params;
      const scores = dataService.getScoresByQuiz(quizId);
      res.json({ success: true, data: scores });
    } catch (error) {
      console.error('Erreur getQuizScores:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des scores' });
    }
  },

  // Get all scores
  getAll: (req: Request, res: Response) => {
    try {
      const scores = dataService.getScores();
      res.json({ success: true, data: scores });
    } catch (error) {
      console.error('Erreur getAll:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des scores' });
    }
  }
};