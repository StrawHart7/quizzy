import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Award, Clock, BookOpen, 
  BarChart3, Loader2, ArrowUp, ArrowDown,
  CircleCheck, CircleX
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { api } from '../utils/api';
import { BADGES, calculateLevel, calculateXP } from '../utils/gamification';
import type { Score } from '../types';
import { BadgeComponent } from '../components/common/Badge';
import { LevelProgress } from '../components/common/LevelProgress';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { quizzes } = useAdmin();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalPoints: 0,
    passedCount: 0,
    failedCount: 0,
    timeSpent: 0,
  });
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<Score[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getUserScores(user.id, token);
        if (response.success) {
          const userScores: Score[] = response.data || [];
          setScores(userScores);

          const totalQuizzes = userScores.length;
          const totalScore = userScores.reduce((acc: number, s: Score) => acc + s.percentage, 0);
          const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
          const bestScore = totalQuizzes > 0 ? Math.max(...userScores.map((s: Score) => s.percentage)) : 0;
          const totalPoints = userScores.reduce((acc: number, s: Score) => acc + s.totalPoints, 0);
          const passedCount = userScores.filter((s: Score) => s.percentage >= 60).length;
          const failedCount = userScores.filter((s: Score) => s.percentage < 60).length;
          const timeSpent = userScores.reduce((acc: number, s: Score) => acc + s.timeSpent, 0);

          setStats({
            totalQuizzes,
            averageScore,
            bestScore,
            totalPoints,
            passedCount,
            failedCount,
            timeSpent,
          });

          const totalXP = userScores.reduce((acc: number, s: Score) => acc + calculateXP(s), 0);
          setXp(totalXP);
          setLevel(calculateLevel(totalXP));

          const unlockedBadges = BADGES
            .filter((b) => b.condition(userScores))
            .map((b) => b.id);
          setBadges(unlockedBadges);

          setRecentActivity(userScores.slice(-10).reverse());
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, user]);

  if (!token) {
    return (
      <Layout>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Connectez-vous pour voir votre tableau de bord
          </h2>
          <p className="text-gray-500 dark:text-dark-muted mb-6">
            Suivez votre progression et vos statistiques
          </p>
          <Button onClick={() => navigate('/login')}>
            Se connecter
          </Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </Layout>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>

        {/* Niveau et XP */}
        <motion.div variants={item}>
          <LevelProgress xp={xp} level={level} />
        </motion.div>

        {/* Badges */}
        <motion.div variants={item}>
          <Card title="Badges débloqués">
            <div className="flex flex-wrap gap-4">
              {BADGES.map((badge) => {
                const unlocked = badges.includes(badge.id);
                return (
                  <BadgeComponent
                    key={badge.id}
                    id={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    unlocked={unlocked}
                  />
                );
              })}
            </div>
            {badges.length === 0 && (
              <p className="text-gray-500 dark:text-dark-muted text-center py-4">
                Aucun badge débloqué pour le moment. Continuez à vous entraîner !
              </p>
            )}
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div variants={item}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalQuizzes}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Quiz complétés
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.averageScore)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Moyenne
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <Award className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.bestScore)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Meilleur score
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <BarChart3 className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPoints}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Points total
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Taux de réussite */}
        <motion.div variants={item}>
          <Card title="Taux de réussite">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <CircleCheck className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                  {stats.passedCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Réussis
                </p>
              </div>
              <div className="text-center">
                <CircleX className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                  {stats.failedCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Échoués
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-500 dark:text-purple-400">
                  {Math.floor(stats.timeSpent / 60)}min
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Temps total
                </p>
              </div>
            </div>
            {stats.totalQuizzes > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-dark-surface rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.passedCount / stats.totalQuizzes) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-dark-muted text-center mt-2">
                  {Math.round((stats.passedCount / stats.totalQuizzes) * 100)}% de réussite
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Activité récente */}
        <motion.div variants={item}>
          <Card title="Activité récente">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-dark-muted text-center py-4">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((score: Score, index: number) => {
                  const isPassed = score.percentage >= 60;
                  const date = new Date(score.endTime);
                  const quiz = quizzes.find(q => q.id === score.quizId);
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          isPassed 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {isPassed ? (
                            <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {quiz?.title || 'Quiz'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-dark-muted">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {date.toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })} à {date.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          isPassed 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {Math.round(score.percentage)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                          {score.totalPoints}/{score.maxPoints} pts
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};