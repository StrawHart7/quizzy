import React, { useEffect } from 'react';
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { QuestionQCM } from './QuestionQCM';
import { QuestionUnique } from './QuestionUnique';
import { QuestionVF } from './QuestionVF';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { Quiz, Score } from '../../types';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: Score) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete }) => {
  const {
    currentQuestion,
    currentAnswer,
    isComplete,
    progress,
    timeLeft,
    totalQuestions,
    answeredQuestions,
    startQuiz,
    nextQuestion,
    previousQuestion,
    selectAnswer,
    calculateScore,
    isLastQuestion,
    canGoPrevious,
    canGoNext
  } = useQuizEngine(quiz);

  useEffect(() => {
    startQuiz();
  }, []);

  useEffect(() => {
    if (isComplete) {
      const score = calculateScore();
      if (score) {
        onComplete(score);
      }
    }
  }, [isComplete, calculateScore, onComplete]);

  if (!currentQuestion) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-[#8888a0]">
            Le quiz est terminé ou en cours de chargement...
          </p>
        </div>
      </Card>
    );
  }

  const renderQuestion = () => {
    const baseProps = {
      question: currentQuestion,
      onSelect: selectAnswer,
      isReadOnly: isComplete
    };

    switch (currentQuestion.type) {
      case 'qcm':
        return (
          <QuestionQCM 
            {...baseProps}
            selectedAnswer={Array.isArray(currentAnswer) ? currentAnswer : []}
          />
        );
      case 'unique':
        return (
          <QuestionUnique 
            {...baseProps}
            selectedAnswer={typeof currentAnswer === 'string' ? currentAnswer : ''}
          />
        );
      case 'vf':
        return (
          <QuestionVF 
            {...baseProps}
            selectedAnswer={typeof currentAnswer === 'string' ? currentAnswer : ''}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#e8e8f0]">
              {quiz.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#8888a0]">
              Question {answeredQuestions + 1} sur {totalQuestions}
            </p>
          </div>
          {timeLeft !== null && (
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 dark:bg-[#2a2a4a] rounded-full h-2.5">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="py-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#e8e8f0] mb-4">
            {currentQuestion.text}
          </h3>
          {renderQuestion()}
          {currentQuestion.explanation && isComplete && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Explication :</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {!isComplete && (
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-[#2a2a4a]">
            <Button
              variant="secondary"
              onClick={previousQuestion}
              disabled={!canGoPrevious}
            >
              ← Précédent
            </Button>
            <Button
              variant="primary"
              onClick={nextQuestion}
              disabled={!canGoNext}
            >
              {isLastQuestion ? 'Terminer ✓' : 'Suivant →'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};