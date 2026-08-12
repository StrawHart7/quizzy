import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Layers, ChevronRight, ArrowLeft, 
  Loader2, BookOpen, Tag, Clock, Settings, Shield
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { QuizForm } from '../components/admin/QuizForm';
import { QuestionForm } from '../components/admin/QuestionForm';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import type { Quiz, Question } from '../types';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isTeacher } = useAuth();
  const { 
    quizzes, 
    loading, 
    error, 
    loadQuizzes,
    addQuiz, 
    updateQuiz, 
    deleteQuiz, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion 
  } = useAdmin();
  
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);
  const [editingQuestion, setEditingQuestion] = useState<{ quizId: string; question: Question } | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Vérifier les droits d'accès
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Seuls admin et teacher peuvent accéder à l'admin
    if (!isAdmin && !isTeacher) {
      navigate('/quizzes');
    }
  }, [isAuthenticated, isAdmin, isTeacher, navigate]);

  // Charger les quiz
  useEffect(() => {
    if (quizzes.length === 0 && !loading && isAuthenticated && (isAdmin || isTeacher)) {
      loadQuizzes();
    }
  }, [quizzes.length, loading, isAuthenticated, isAdmin, isTeacher, loadQuizzes]);

  const handleAddQuiz = async (data: Omit<Quiz, 'id' | 'createdAt'>) => {
    const success = await addQuiz(data);
    if (success) {
      setEditingQuiz(undefined);
      loadQuizzes();
    }
  };

  const handleUpdateQuiz = async (data: Omit<Quiz, 'id' | 'createdAt'>) => {
    if (editingQuiz) {
      const success = await updateQuiz(editingQuiz.id, data);
      if (success) {
        setEditingQuiz(undefined);
        setSelectedQuiz(null);
        loadQuizzes();
      }
    }
  };

  const handleAddQuestion = async (data: Omit<Question, 'id'>) => {
    if (selectedQuiz) {
      const success = await addQuestion(selectedQuiz.id, data);
      if (success) {
        setIsAddingQuestion(false);
        loadQuizzes();
        const updatedQuiz = quizzes.find(q => q.id === selectedQuiz.id);
        if (updatedQuiz) {
          setSelectedQuiz(updatedQuiz);
        }
      }
    }
  };

  const handleUpdateQuestion = async (data: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      const success = await updateQuestion(editingQuestion.quizId, editingQuestion.question.id, data);
      if (success) {
        setEditingQuestion(null);
        loadQuizzes();
        const updatedQuiz = quizzes.find(q => q.id === editingQuestion.quizId);
        if (updatedQuiz) {
          setSelectedQuiz(updatedQuiz);
        }
      }
    }
  };

  const handleDeleteQuestion = async (quizId: string, questionId: string) => {
    if (confirm('Supprimer cette question ?')) {
      const success = await deleteQuestion(quizId, questionId);
      if (success) {
        loadQuizzes();
        const updatedQuiz = quizzes.find(q => q.id === quizId);
        if (updatedQuiz) {
          setSelectedQuiz(updatedQuiz);
        }
      }
    }
  };

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return null;
  }

  // Si l'utilisateur n'est pas admin ni teacher
  if (!isAdmin && !isTeacher) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Accès restreint
          </h2>
          <p className="text-gray-500 dark:text-[#8888a0] mb-6">
            Vous devez être enseignant ou administrateur pour accéder à cette page.
          </p>
          <Button onClick={() => navigate('/quizzes')}>
            Voir les quiz
          </Button>
        </div>
      </Layout>
    );
  }

  // État de chargement
  if (loading && quizzes.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
        </div>
      </Layout>
    );
  }

  // Vue d'un quiz spécifique
  if (selectedQuiz) {
    return (
      <Layout>
        <div className="page-container">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="inline-flex items-center space-x-2 text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la liste</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-[#e8e8f0]">
                {selectedQuiz.title}
              </h1>
              <p className="text-[#64748b] dark:text-[#b0b0c8]">{selectedQuiz.description}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setEditingQuiz(selectedQuiz)}
                icon={<Edit className="w-4 h-4" />}
              >
                Modifier
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={async () => {
                  if (confirm('Supprimer ce quiz ?')) {
                    const success = await deleteQuiz(selectedQuiz.id);
                    if (success) {
                      setSelectedQuiz(null);
                      loadQuizzes();
                    }
                  }
                }}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Supprimer
              </Button>
            </div>
          </div>

          {/* Formulaire d'édition du quiz */}
          {editingQuiz && (
            <div className="mb-6">
              <QuizForm
                quiz={editingQuiz}
                onSubmit={handleUpdateQuiz}
                onCancel={() => setEditingQuiz(undefined)}
              />
            </div>
          )}

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#0f172a] dark:text-[#e8e8f0]">
                Questions ({selectedQuiz.questions.length})
              </h2>
              <Button 
                size="sm" 
                onClick={() => setIsAddingQuestion(true)}
                icon={<Plus className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Ajouter une question
              </Button>
            </div>

            {/* Formulaire d'ajout de question */}
            {isAddingQuestion && (
              <div className="mb-4">
                <QuestionForm
                  onSubmit={handleAddQuestion}
                  onCancel={() => setIsAddingQuestion(false)}
                />
              </div>
            )}

            {/* Liste des questions */}
            {selectedQuiz.questions.length === 0 ? (
              <Card>
                <div className="text-center py-8 text-[#94a3b8] dark:text-[#6b6b85]">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#94a3b8] dark:text-[#6b6b85]" />
                  <p>Aucune question pour ce quiz</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setIsAddingQuestion(true)}
                    className="mt-4"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ajouter une question
                  </Button>
                </div>
              </Card>
            ) : (
              selectedQuiz.questions.map((question) => (
                <Card 
                  key={question.id}
                  title={question.text}
                  header={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${
                        question.type === 'qcm' ? 'badge-purple' :
                        question.type === 'unique' ? 'badge-blue' :
                        'badge-green'
                      }`}>
                        {question.type === 'qcm' ? 'QCM' :
                         question.type === 'unique' ? 'Unique' : 'V/F'}
                      </span>
                      <span className="badge badge-yellow">{question.points} pts</span>
                      <button
                        onClick={() => setEditingQuestion({ 
                          quizId: selectedQuiz.id, 
                          question 
                        })}
                        className="p-1.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors text-[#64748b] dark:text-[#b0b0c8]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(selectedQuiz.id, question.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  }
                >
                  <div className="space-y-2">
                    {question.options && question.options.length > 0 && (
                      <div className="text-sm text-[#64748b] dark:text-[#b0b0c8]">
                        <span className="font-medium">Options:</span>
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                          {question.options.map((opt, idx) => (
                            <li key={idx} className="text-[#334155] dark:text-[#b0b0c8]">{opt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">Réponse correcte:</span>{' '}
                      {Array.isArray(question.correctAnswer) 
                        ? question.correctAnswer.join(', ') 
                        : question.correctAnswer}
                    </div>
                    {question.explanation && (
                      <div className="text-sm text-[#64748b] dark:text-[#6b6b85] bg-[#f8fafc] dark:bg-[#1a1a2e] p-3 rounded-lg mt-2">
                        <span className="font-medium">Explication:</span> {question.explanation}
                      </div>
                    )}
                  </div>

                  {/* Formulaire d'édition de question */}
                  {editingQuestion && editingQuestion.question.id === question.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2a4a]">
                      <QuestionForm
                        question={editingQuestion.question}
                        onSubmit={handleUpdateQuestion}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Formulaire de création de quiz
  if (editingQuiz) {
    return (
      <Layout>
        <div className="page-container max-w-2xl">
          <button
            onClick={() => setEditingQuiz(undefined)}
            className="inline-flex items-center space-x-2 text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <QuizForm
            onSubmit={handleAddQuiz}
            onCancel={() => setEditingQuiz(undefined)}
          />
        </div>
      </Layout>
    );
  }

  // Liste des quiz (page admin principale)
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">
            <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-[#4f46e5]" />
            Administration
            {isAdmin && (
              <span className="text-sm font-medium text-[#4f46e5] dark:text-[#818cf8] bg-[#eef2ff] dark:bg-[#1e1b4b] px-3 py-1 rounded-full">
                Admin
              </span>
            )}
            {isTeacher && !isAdmin && (
              <span className="text-sm font-medium text-[#f59e0b] bg-[#fef3c7] dark:bg-[#422006] px-3 py-1 rounded-full">
                Enseignant
              </span>
            )}
          </h1>
          <Button 
            onClick={() => setEditingQuiz({} as Quiz)} 
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Nouveau quiz
          </Button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadQuizzes} className="text-[#4f46e5] dark:text-[#818cf8] hover:underline text-sm font-medium">
              Réessayer
            </button>
          </div>
        )}

        {/* Liste des quiz */}
        {quizzes.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-[#94a3b8] dark:text-[#6b6b85] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#0f172a] dark:text-[#e8e8f0] mb-2">
                Aucun quiz
              </h3>
              <p className="text-[#64748b] dark:text-[#b0b0c8] mb-6">
                Créez votre premier quiz dès maintenant
              </p>
              <Button 
                onClick={() => setEditingQuiz({} as Quiz)} 
                icon={<Plus className="w-4 h-4" />}
              >
                Créer un quiz
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Card 
                key={quiz.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <div 
                  className="flex flex-col h-full cursor-pointer"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#e8e8f0] mb-1 flex-1">
                        {quiz.title}
                      </h3>
                      {quiz.createdBy === user?.id && (
                        <span className="text-xs text-[#64748b] dark:text-[#6b6b85] bg-[#f1f5f9] dark:bg-[#2a2a4a] px-2 py-0.5 rounded-full whitespace-nowrap">
                          Vous
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#64748b] dark:text-[#b0b0c8] mb-3 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-blue flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {quiz.category}
                      </span>
                      <span className={`badge flex items-center gap-1 ${
                        quiz.difficulty === 'facile' ? 'badge-green' :
                        quiz.difficulty === 'moyen' ? 'badge-yellow' :
                        'badge-red'
                      }`}>
                        {quiz.difficulty}
                      </span>
                      <span className="badge badge-purple flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {quiz.questions.length} questions
                      </span>
                      {quiz.timeLimit && (
                        <span className="badge badge-yellow flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.floor(quiz.timeLimit / 60)}min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2a4a] flex justify-end">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      icon={<ChevronRight className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuiz(quiz);
                      }}
                    >
                      Gérer
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};