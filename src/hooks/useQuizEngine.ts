import { useState, useCallback, useEffect } from 'react';
import	type  { Quiz, Question, Answer, Score } from '../types';

interface QuizState {
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: Date | null;
  endTime: Date | null;
  timeSpent: number;
  isComplete: boolean;
}

export const useQuizEngine = (quiz: Quiz | null) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    endTime: null,
    timeSpent: 0,
    isComplete: false
  });

  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | null>(null);

  // Démarrer le quiz
  const startQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      startTime: new Date(),
      endTime: null,
      timeSpent: 0,
      isComplete: false,
      currentQuestionIndex: 0,
      answers: []
    }));
    setCurrentAnswer(null);
  }, []);

  // Passer à la question suivante
  const nextQuestion = useCallback(() => {
    if (!quiz) return;

    // Sauvegarder la réponse actuelle
    if (currentAnswer !== null) {
      const currentQuestion = quiz.questions[state.currentQuestionIndex];
      
      // CORRECTION ICI : Gérer correctement les différents types
      let isCorrect = false;
      
      if (Array.isArray(currentQuestion.correctAnswer)) {
        // Pour les QCM (réponses multiples)
        if (Array.isArray(currentAnswer)) {
          const sortedCorrect = [...currentQuestion.correctAnswer].sort();
          const sortedAnswer = [...currentAnswer].sort();
          isCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedAnswer);
        }
      } else {
        // Pour les réponses uniques ou V/F
        isCorrect = currentAnswer === currentQuestion.correctAnswer;
      }

      const answer: Answer = {
        questionId: currentQuestion.id,
        userAnswer: currentAnswer,
        isCorrect,
        pointsEarned: isCorrect ? currentQuestion.points : 0
      };

      setState(prev => ({
        ...prev,
        answers: [...prev.answers, answer]
      }));
      setCurrentAnswer(null);
    }

    // Passer à la question suivante ou terminer
    if (state.currentQuestionIndex < quiz.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Quiz terminé
      setState(prev => ({
        ...prev,
        endTime: new Date(),
        isComplete: true
      }));
    }
  }, [quiz, state.currentQuestionIndex, currentAnswer]);

  // Revenir à la question précédente
  const previousQuestion = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      // Retirer la dernière réponse
      const newAnswers = state.answers.slice(0, -1);
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        answers: newAnswers
      }));
      setCurrentAnswer(null);
    }
  }, [state.currentQuestionIndex, state.answers]);

  // Sélectionner une réponse
  const selectAnswer = useCallback((answer: string | string[]) => {
    setCurrentAnswer(answer);
  }, []);

  // Calculer le score final
  const calculateScore = useCallback((): Score | null => {
    if (!quiz || !state.isComplete) return null;

    const totalPoints = state.answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
    const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    const timeSpent = state.startTime && state.endTime
      ? (state.endTime.getTime() - state.startTime.getTime()) / 1000
      : 0;

    return {
      userId: 'current-user',
      quizId: quiz.id,
      answers: state.answers,
      totalPoints,
      maxPoints,
      percentage,
      startTime: state.startTime || new Date(),
      endTime: state.endTime || new Date(),
      timeSpent
    };
  }, [quiz, state.answers, state.isComplete, state.startTime, state.endTime]);

  // Obtenir la question actuelle
  const getCurrentQuestion = useCallback((): Question | null => {
    if (!quiz || state.isComplete) return null;
    return quiz.questions[state.currentQuestionIndex] || null;
  }, [quiz, state.currentQuestionIndex, state.isComplete]);

  // Vérifier si c'est la dernière question
  const isLastQuestion = useCallback((): boolean => {
    if (!quiz) return false;
    return state.currentQuestionIndex === quiz.questions.length - 1;
  }, [quiz, state.currentQuestionIndex]);

  // Obtenir la progression
  const getProgress = useCallback((): number => {
    if (!quiz) return 0;
    return (state.answers.length / quiz.questions.length) * 100;
  }, [quiz, state.answers.length]);

  // Timer (optionnel)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (state.startTime && !state.isComplete && quiz?.timeLimit) {
      const timer = setInterval(() => {
        const elapsed = (Date.now() - state.startTime!.getTime()) / 1000;
        const remaining = quiz.timeLimit! - elapsed;
        
        if (remaining <= 0) {
          // Temps écoulé, terminer le quiz
          setState(prev => ({
            ...prev,
            endTime: new Date(),
            isComplete: true
          }));
          setTimeLeft(0);
          clearInterval(timer);
        } else {
          setTimeLeft(Math.ceil(remaining));
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.startTime, state.isComplete, quiz?.timeLimit]);

  return {
    // État
    currentQuestion: getCurrentQuestion(),
    currentAnswer,
    answers: state.answers,
    isComplete: state.isComplete,
    progress: getProgress(),
    timeLeft,
    totalQuestions: quiz?.questions.length || 0,
    answeredQuestions: state.answers.length,
    
    // Actions
    startQuiz,
    nextQuestion,
    previousQuestion,
    selectAnswer,
    calculateScore,
    isLastQuestion: isLastQuestion(),
    canGoPrevious: state.currentQuestionIndex > 0,
    canGoNext: currentAnswer !== null
  };
};