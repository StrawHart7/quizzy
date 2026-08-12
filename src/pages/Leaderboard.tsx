import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, Loader2, RefreshCw, User, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { calculateXP, calculateLevel } from '../utils/gamification';
import type { Score } from '../types';

interface LeaderboardUser {
  id: string;
  username: string;
  totalScore: number;
  averageScore: number;
  quizzesCompleted: number;
  xp: number;
  level: number;
}

export const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const scoresResponse = await api.getScores(token);
      const usersResponse = await api.getUsers(token);
      
      if (scoresResponse.success && usersResponse.success) {
        const allScores: Score[] = scoresResponse.data || [];
        const allUsers = usersResponse.data || [];
        
        const userMap = new Map();
        allUsers.forEach((u: any) => {
          userMap.set(u.id, {
            username: u.username || 'Anonyme',
            role: u.role || 'student'
          });
        });

        const userScoresMap = new Map<string, {
          username: string;
          scores: Score[];
          totalScore: number;
          xp: number;
        }>();

        allUsers.forEach((u: any) => {
          userScoresMap.set(u.id, {
            username: u.username || 'Anonyme',
            scores: [],
            totalScore: 0,
            xp: 0,
          });
        });

        allScores.forEach((score: Score) => {
          const userId = score.userId;
          if (userScoresMap.has(userId)) {
            const userData = userScoresMap.get(userId)!;
            userData.scores.push(score);
            userData.totalScore += score.percentage;
            userData.xp += calculateXP(score);
          } else {
            userScoresMap.set(userId, {
              username: 'Anonyme',
              scores: [score],
              totalScore: score.percentage,
              xp: calculateXP(score),
            });
          }
        });

        const leaderboard: LeaderboardUser[] = Array.from(userScoresMap.entries()).map(([id, data]) => ({
          id,
          username: data.username,
          totalScore: data.totalScore,
          averageScore: data.scores.length > 0 ? data.totalScore / data.scores.length : 0,
          quizzesCompleted: data.scores.length,
          xp: data.xp,
          level: calculateLevel(data.xp),
        }));

        leaderboard.sort((a, b) => b.xp - a.xp);
        setUsers(leaderboard);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Erreur leaderboard:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
  };

  if (!token) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">Connectez-vous pour voir le classement</h2>
          <p className="text-gray-500 dark:text-[#8888a0] mb-6">Comparez vos scores avec les autres joueurs</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Réessayer
          </Button>
        </div>
      </Layout>
    );
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400';
    if (index === 1) return 'bg-gray-100 dark:bg-gray-800 border-gray-400';
    if (index === 2) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-400';
    return 'bg-gray-50 dark:bg-[#1a1a2e] border-gray-200 dark:border-[#2a2a4a]';
  };

  const activeUsers = users.filter(u => u.quizzesCompleted > 0);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white flex items-center">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-yellow-500" />
            Classement
          </h1>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefresh}
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
            disabled={refreshing}
            className="w-full sm:w-auto"
          >
            Rafraîchir
          </Button>
        </div>

        {activeUsers.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-[#8888a0]">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun score enregistré pour le moment</p>
              <p className="text-sm mt-2">Passez un quiz pour apparaître dans le classement !</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${getMedalColor(index)}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {index < 3 ? (
                          getMedalIcon(index)
                        ) : (
                          <span className="text-lg font-bold text-gray-400 dark:text-[#8888a0]">
                            #{index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold dark:text-white flex items-center gap-2 flex-wrap">
                          <span className="truncate">{user.username}</span>
                          {index === 0 && (
                            <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[#8888a0]">
                          {user.quizzesCompleted} quiz • Niveau {user.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto pl-14 sm:pl-0">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(user.averageScore)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#8888a0]">
                        {user.xp} XP
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-[#2a2a4a] rounded-full h-1.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(user.averageScore, 100)}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};