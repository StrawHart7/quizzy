import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import type { Quiz, Question } from '../types';

interface AdminContextType {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  loadQuizzes: () => Promise<void>;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<boolean>;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => Promise<boolean>;
  deleteQuiz: (id: string) => Promise<boolean>;
  addQuestion: (quizId: string, question: Omit<Question, 'id'>) => Promise<boolean>;
  updateQuestion: (quizId: string, questionId: string, question: Partial<Question>) => Promise<boolean>;
  deleteQuestion: (quizId: string, questionId: string) => Promise<boolean>;
  getQuiz: (id: string) => Quiz | undefined;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getQuizzes();
      if (response.success) {
        setQuizzes(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des quiz');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les quiz au montage
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const addQuiz = useCallback(async (quizData: Omit<Quiz, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.createQuiz(quizData, token);
      if (response.success) {
        setQuizzes(prev => [...prev, response.data]);
        return true;
      } else {
        setError(response.error || 'Erreur lors de la création du quiz');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateQuiz = useCallback(async (id: string, quizData: Partial<Quiz>): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.updateQuiz(id, quizData, token);
      if (response.success) {
        setQuizzes(prev => prev.map(q => q.id === id ? response.data : q));
        return true;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour du quiz');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteQuiz = useCallback(async (id: string): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.deleteQuiz(id, token);
      if (response.success) {
        setQuizzes(prev => prev.filter(q => q.id !== id));
        return true;
      } else {
        setError(response.error || 'Erreur lors de la suppression du quiz');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addQuestion = useCallback(async (quizId: string, questionData: Omit<Question, 'id'>): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.addQuestion(quizId, questionData, token);
      if (response.success) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? response.data : q));
        return true;
      } else {
        setError(response.error || 'Erreur lors de l\'ajout de la question');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateQuestion = useCallback(async (quizId: string, questionId: string, questionData: Partial<Question>): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.updateQuestion(quizId, questionId, questionData, token);
      if (response.success) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? response.data : q));
        return true;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour de la question');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteQuestion = useCallback(async (quizId: string, questionId: string): Promise<boolean> => {
    if (!token) {
      setError('Vous devez être connecté');
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.deleteQuestion(quizId, questionId, token);
      if (response.success) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? response.data : q));
        return true;
      } else {
        setError(response.error || 'Erreur lors de la suppression de la question');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getQuiz = useCallback((id: string): Quiz | undefined => {
    return quizzes.find(q => q.id === id);
  }, [quizzes]);

  return (
    <AdminContext.Provider value={{
      quizzes,
      loading,
      error,
      loadQuizzes,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      getQuiz
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};