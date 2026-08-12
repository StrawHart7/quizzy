import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, CheckCircle, XCircle, Clock, Award, 
  TrendingUp, BarChart3, Loader2, Share2, X, Copy, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import type { Score } from '../types';

interface ResultsProps {
  score: Score | null;
  quizTitle?: string;
  onBackToQuizzes?: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  score, 
  quizTitle,
  onBackToQuizzes
}) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    const saveScore = async () => {
      if (!score || saved || saving || hasSaved.current) return;
      
      hasSaved.current = true;
      setSaving(true);
      
      try {
        const scoreToSave = {
          ...score,
          userId: user?.id || 'anonymous'
        };
        
        const response = await api.saveScore(scoreToSave, token || undefined);
        if (response.success) {
          setSaved(true);
        } else {
          console.error('Erreur lors de la sauvegarde:', response.error);
          hasSaved.current = false;
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du score:', error);
        hasSaved.current = false;
      } finally {
        setSaving(false);
      }
    };

    saveScore();
  }, [score, token, user]);

  const handleBackToQuizzes = () => {
    if (onBackToQuizzes) {
      onBackToQuizzes();
    } else {
      navigate('/quizzes');
    }
  };

  const shareText = `J'ai obtenu ${Math.round(score?.percentage || 0)}% au quiz "${quizTitle}" sur Quiz L2 !`;

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  if (!score) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Aucun résultat disponible</p>
          <Button onClick={() => navigate('/')} className="mt-4" icon={<Home className="w-4 h-4" />}>
            Accueil
          </Button>
        </div>
      </Layout>
    );
  }

  const isPassed = score.percentage >= 60;
  const grade = score.percentage >= 80 ? 'Excellent' :
                score.percentage >= 60 ? 'Bien' :
                score.percentage >= 40 ? 'Peut mieux faire' :
                'À réviser';

  const correctCount = score.answers.filter(a => a.isCorrect).length;
  const incorrectCount = score.answers.filter(a => !a.isCorrect).length;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card title={`Résultats : ${quizTitle || 'Quiz'}`}>
            <div className="space-y-6">
              {/* Sauvegarde du score */}
              {saving && (
                <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sauvegarde du score...</span>
                </div>
              )}
              {saved && (
                <div className="text-center text-sm text-green-600 dark:text-green-400">
                  Score sauvegardé
                </div>
              )}

              {/* Score global */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="text-6xl font-bold mb-2 dark:text-white">
                    {Math.round(score.percentage)}%
                  </div>
                  <Award className={`w-12 h-12 absolute -top-6 -right-12 ${
                    isPassed ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className={`text-xl font-semibold flex items-center justify-center space-x-2 ${
                  isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendingUp className="w-5 h-5" />
                  <span>{grade}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {score.totalPoints} points sur {score.maxPoints} possibles
                </p>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bonnes réponses</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {incorrectCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mauvaises réponses</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(score.timeSpent / 60)}:{Math.floor(score.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Temps total</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {score.answers.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Questions traitées</div>
                </div>
              </div>

              {/* Feedback final */}
              <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                isPassed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {isPassed ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <p className={`font-medium ${
                  isPassed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                }`}>
                  {isPassed 
                    ? 'Félicitations ! Vous avez réussi ce quiz !'
                    : 'Continuez à vous entraîner, vous allez y arriver !'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="secondary" 
                    className="flex-1" 
                    icon={<Home className="w-4 h-4" />}
                  >
                    Accueil
                  </Button>
                  <Button 
                    onClick={handleBackToQuizzes}
                    className="flex-1" 
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Autres quiz
                  </Button>
                </div>
                
                {/* Partage */}
                <div className="relative">
                  <Button
                    variant="secondary"
                    className="w-full"
                    icon={<Share2 className="w-4 h-4" />}
                    onClick={() => setShareOpen(!shareOpen)}
                  >
                    Partager mes résultats
                  </Button>
                  {shareOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border z-10"
                    >
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={shareOnTwitter}
                          icon={<X className="w-4 h-4 text-blue-400" />}
                          className="flex-1"
                        >
                          Twitter
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={shareOnLinkedIn}
                          icon={<X className="w-4 h-4 text-blue-600" />}
                          className="flex-1"
                        >
                          LinkedIn
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={copyLink}
                          icon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          className="flex-1"
                        >
                          {copied ? 'Copié' : 'Lien'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};