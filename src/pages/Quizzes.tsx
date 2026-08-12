import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Layers, Tag, Loader2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { Results } from './Results';
import { useAdmin } from '../contexts/AdminContext';
import type { Quiz, Score } from '../types';

export const Quizzes: React.FC = () => {
  const { quizzes, loading, error, loadQuizzes } = useAdmin();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<Score | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizResult(null);
  };

  const handleQuizComplete = (score: Score) => {
    setQuizResult(score);
  };

  const handleBackToQuizzes = () => { // <-- AJOUT : Fonction pour revenir à la liste
    setSelectedQuiz(null);
    setQuizResult(null);
  };

  // Si un résultat est affiché
  if (quizResult && selectedQuiz) {
    return (
      <Results 
        score={quizResult} 
        quizTitle={selectedQuiz.title}
        onBackToQuizzes={handleBackToQuizzes} // <-- AJOUT : Passer le callback
      />
    );
  }

  // Si un quiz est en cours
  if (selectedQuiz) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleBackToQuizzes}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux quiz</span>
          </button>
          <QuizPlayer 
            quiz={selectedQuiz} 
            onComplete={handleQuizComplete} 
          />
        </div>
      </Layout>
    );
  }

  // État de chargement
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadQuizzes} className="mt-4">
            Réessayer
          </Button>
        </div>
      </Layout>
    );
  }

  // Liste des quiz
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-blue-600" />
          Quiz disponibles
        </h1>
        {quizzes.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <p>Aucun quiz disponible pour le moment.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} title={quiz.title}>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{quiz.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>{quiz.category}</span>
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                      quiz.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <span>{quiz.difficulty}</span>
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center space-x-1">
                      <Layers className="w-3 h-3" />
                      <span>{quiz.questions.length} questions</span>
                    </span>
                    {quiz.timeLimit && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{Math.floor(quiz.timeLimit / 60)}min</span>
                      </span>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full"
                    icon={<Play className="w-4 h-4" />}
                  >
                    Démarrer le quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};