import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Loader2, Check, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const UpgradeTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { token, user, isTeacher, isAdmin, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Vérifier le statut au chargement
  useEffect(() => {
    const checkStatus = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await api.getTeacherStatus(token);
        if (response.success && response.data.isTeacher) {
          await refreshUser();
          toast.success('Vous êtes déjà enseignant !');
          navigate('/admin');
          return;
        }
      } catch (error) {
        console.error('Erreur vérification statut:', error);
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [token, navigate, refreshUser]);

  // Si déjà enseignant
  if (isTeacher || isAdmin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Vous êtes déjà enseignant
          </h2>
          <p className="text-gray-500 dark:text-[#8888a0] mb-6">
            Vous avez accès à toutes les fonctionnalités enseignantes
          </p>
          <Button onClick={() => navigate('/admin')}>
            Accéder à l'administration
          </Button>
        </div>
      </Layout>
    );
  }

  if (checking) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  const handleUpgrade = async () => {
    if (!token || !user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setLoading(true);

    try {
      const response = await api.createPaymentTransaction(token);

      if (!response.success) {
        toast.error(response.error || 'Erreur lors de la création de la transaction');
        setLoading(false);
        return;
      }

      if (response.paymentUrl) {
        window.open(response.paymentUrl, '_blank');
        toast.success('Redirection vers FedaPay en cours...');
        setLoading(false);
        toast('Après le paiement, revenez sur cette page', { duration: 5000 });
      } else {
        toast.error('URL de paiement non disponible');
        setLoading(false);
      }

    } catch (error: any) {
      console.error('Erreur upgrade:', error);
      toast.error(error.message || 'Erreur lors du processus de paiement');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
            <Crown className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Devenir enseignant
          </h1>
          <p className="text-gray-500 dark:text-[#8888a0] mt-2">
            Accédez à toutes les fonctionnalités d'enseignement
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Créer des quiz</h3>
                  <p className="text-sm text-gray-500 dark:text-[#8888a0]">
                    Créez vos propres quiz avec des questions personnalisées
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Partager vos quiz</h3>
                  <p className="text-sm text-gray-500 dark:text-[#8888a0]">
                    Partagez vos quiz avec vos élèves et collègues
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Suivre les résultats</h3>
                  <p className="text-sm text-gray-500 dark:text-[#8888a0]">
                    Analysez les performances de vos élèves
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Statut premium</h3>
                  <p className="text-sm text-gray-500 dark:text-[#8888a0]">
                    Bénéficiez d'un badge enseignant et de fonctionnalités exclusives
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-[#2a2a4a] pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">19.99€</span>
                  <span className="text-sm text-gray-500 dark:text-[#8888a0] ml-2">Paiement unique</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-[#8888a0]">
                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                    Sécurisé
                  </span>
                </div>
              </div>

              <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 text-base"
                icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
              >
                {loading ? 'Traitement en cours...' : 'Devenir enseignant'}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 dark:text-[#6b6b85]">
                  Paiement sécurisé via FedaPay • Mode test (sandbox)
                </p>
                <p className="text-xs text-gray-400 dark:text-[#6b6b85] mt-1">
                  ✓ 14 jours de garantie satisfait ou remboursé
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-[#6b6b85]">
            En devenant enseignant, vous acceptez nos conditions d'utilisation
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#4f46e5] dark:text-[#818cf8] hover:underline mt-2"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </Layout>
  );
};