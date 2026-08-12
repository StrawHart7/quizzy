import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, Award, Loader2, Calendar, BookOpen } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import type { Score } from '../types';

export const Scores: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScores = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les scores de l'utilisateur
        const response = await api.getUserScores(user?.id || '', token);
        
        if (response.success) {
          setScores(response.data || []);
        } else {
          setError(response.error || 'Erreur lors du chargement des scores');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, [token, user]);

  // Si l'utilisateur n'est pas connecté
  if (!token) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Connectez-vous pour voir vos scores</h2>
          <p className="text-gray-500 mb-6">Vous devez être connecté pour consulter votre historique de scores.</p>
          <Button onClick={() => navigate('/login')} icon={<BarChart3 className="w-4 h-4" />}>
            Se connecter
          </Button>
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
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </Layout>
    );
  }

  // Aucun score
  if (scores.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucun score enregistré</h2>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de quiz. Commencez dès maintenant !</p>
          <Button onClick={() => navigate('/quizzes')} icon={<BookOpen className="w-4 h-4" />}>
            Voir les quiz
          </Button>
        </div>
      </Layout>
    );
  }

  // Statistiques globales
  const totalQuizzes = scores.length;
  const averageScore = scores.reduce((acc, s) => acc + s.percentage, 0) / totalQuizzes;
  const bestScore = Math.max(...scores.map(s => s.percentage));
  const totalPoints = scores.reduce((acc, s) => acc + s.totalPoints, 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
          Mes scores
        </h1>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Quiz passés</p>
              <p className="text-2xl font-bold text-blue-600">{totalQuizzes}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Moyenne</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(averageScore)}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Meilleur score</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round(bestScore)}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Points total</p>
              <p className="text-2xl font-bold text-orange-600">{totalPoints}</p>
            </div>
          </Card>
        </div>

        {/* Liste des scores */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Historique</h2>
        <div className="space-y-4">
          {scores.map((score, index) => {
            const isPassed = score.percentage >= 60;
            const date = new Date(score.endTime);
            const formattedDate = date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <Card key={index}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isPassed ? 'Réussi ✓' : 'Échoué ✗'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {Math.round(score.percentage)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {score.totalPoints} / {score.maxPoints} points
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(score.timeSpent / 60)}:{Math.floor(score.timeSpent % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPassed ? 'bg-green-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${score.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => navigate('/quizzes')}
                      icon={<BookOpen className="w-3 h-3" />}
                    >
                      Refaire
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};