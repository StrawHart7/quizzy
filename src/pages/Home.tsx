import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart3, Settings, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  useAuth();

  return (
    <Layout>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-[#e8e8f0] mb-4">
          Bienvenue sur Quiz L2
        </h1>
        <p className="text-lg text-gray-600 dark:text-[#b0b0c8] mb-8">
          Testez vos connaissances avec nos quiz interactifs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex flex-col items-center">
              <BookOpen className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-[#e8e8f0] mb-2">
                Quiz disponibles
              </h3>
              <p className="text-gray-600 dark:text-[#b0b0c8] mb-4 text-center">
                Choisissez parmi plusieurs quiz dans différentes catégories
              </p>
              <Button onClick={() => navigate('/quizzes')} icon={<ChevronRight className="w-4 h-4" />}>
                Voir les quiz
              </Button>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center">
              <BarChart3 className="w-12 h-12 text-green-500 dark:text-green-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-[#e8e8f0] mb-2">
                Suivez vos progrès
              </h3>
              <p className="text-gray-600 dark:text-[#b0b0c8] mb-4 text-center">
                Consultez votre historique et améliorez vos scores
              </p>
              <Button variant="secondary" onClick={() => navigate('/scores')} icon={<ChevronRight className="w-4 h-4" />}>
                Mes scores
              </Button>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center">
              <Settings className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-[#e8e8f0] mb-2">
                Mode Admin
              </h3>
              <p className="text-gray-600 dark:text-[#b0b0c8] mb-4 text-center">
                Créez et gérez vos propres quiz
              </p>
              <Button variant="secondary" onClick={() => navigate('/admin')} icon={<ChevronRight className="w-4 h-4" />}>
                Administrer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};