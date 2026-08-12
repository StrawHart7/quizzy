import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';

export const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="text-center py-12">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Paiement annulé
        </h1>
        <p className="text-gray-500 dark:text-[#8888a0] mb-6">
          Vous avez annulé le paiement. Vous pouvez réessayer quand vous voulez.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/upgrade')}>
            Réessayer
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Layout>
  );
};