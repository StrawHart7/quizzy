import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { token, refreshUser, user, isTeacher } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Si déjà enseignant, rediriger directement
        if (isTeacher) {
          setVerified(true);
          setLoading(false);
          toast.success('Vous êtes déjà enseignant !');
          setTimeout(() => navigate('/dashboard'), 1500);
          return;
        }

        // Récupérer le transactionId depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get('transaction_id');
        const tokenParam = urlParams.get('token');
        const id = transactionId || tokenParam;

        if (!id) {
          // Si pas d'ID mais que l'utilisateur est enseignant, c'est bon
          if (isTeacher) {
            setVerified(true);
            setLoading(false);
            setTimeout(() => navigate('/dashboard'), 1500);
            return;
          }
          setError('Informations de paiement manquantes');
          setLoading(false);
          return;
        }

        // Vérifier la transaction
        const response = await api.verifyPayment(id, token || '');
        
        if (response.success) {
          setVerified(true);
          toast.success('Paiement confirmé !');
          
          // Rafraîchir l'utilisateur
          await refreshUser();
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Si la transaction n'est pas trouvée mais que l'utilisateur est enseignant
          if (isTeacher) {
            setVerified(true);
            setLoading(false);
            toast.success('Vous êtes déjà enseignant !');
            setTimeout(() => navigate('/dashboard'), 1500);
            return;
          }
          setError(response.error || 'Erreur lors de la vérification');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur vérification:', error);
        // Si erreur mais que l'utilisateur est enseignant
        if (isTeacher) {
          setVerified(true);
          setLoading(false);
          toast.success('Vous êtes déjà enseignant !');
          setTimeout(() => navigate('/dashboard'), 1500);
          return;
        }
        setError('Erreur de vérification du paiement');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [token, navigate, refreshUser, isTeacher]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Vérification du paiement...
          </h2>
          <p className="text-gray-500 dark:text-[#8888a0]">
            Merci de patienter pendant que nous confirmons votre paiement.
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Erreur de vérification
          </h1>
          <p className="text-gray-500 dark:text-[#8888a0] mb-6">
            {error}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate('/upgrade')}>
              Réessayer
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Voir mon tableau de bord
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (verified) {
    return (
      <Layout>
        <div className="text-center py-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Paiement réussi !
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Félicitations ! Vous êtes maintenant enseignant.
          </p>
          <p className="text-gray-500 dark:text-[#8888a0] mb-8">
            Vous allez être redirigé vers votre tableau de bord.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Accéder au tableau de bord
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Paiement en cours
        </h1>
        <p className="text-gray-500 dark:text-[#8888a0] mb-6">
          Nous attendons la confirmation de FedaPay.
        </p>
        <Button onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    </Layout>
  );
};