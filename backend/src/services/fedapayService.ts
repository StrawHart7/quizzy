import axios from 'axios';
import dotenv from 'dotenv';
import dataService from './dataService';

dotenv.config();

export const fedapayService = {
  createTransactionToken: async (userId: string, email: string, username: string) => {
    try {
      const apiKey = process.env.FEDAPAY_API_KEY;
      
      if (!apiKey) {
        return { success: false, error: 'Configuration de paiement manquante' };
      }

      const response = await axios.post(
        'https://sandbox-api.fedapay.com/v1/transactions',
        {
          description: 'Devenir enseignant sur Quiz L2',
          amount: 1999,
          currency: { iso: 'XOF' },
          callback_url: `${process.env.FRONTEND_URL}/payment-success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
          customer: {
            email: email,
            firstname: username,
            lastname: username,
          },
          metadata: {
            userId: userId,
            username: username,
            type: 'upgrade_to_teacher',
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const transaction = response.data['v1/transaction'];

      return {
        success: true,
        paymentUrl: transaction.payment_url,
        transactionId: String(transaction.id),
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la création de la transaction'
      };
    }
  },

  verifyTransaction: async (transactionId: string) => {
    try {
      const apiKey = process.env.FEDAPAY_API_KEY;
      
      const response = await axios.get(
        `https://sandbox-api.fedapay.com/v1/transactions/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const transaction = response.data['v1/transaction'];

      if (transaction.status === 'paid' || transaction.status === 'success') {
        return { success: true, transaction };
      }

      return {
        success: false,
        error: 'Transaction non payee',
        status: transaction.status,
      };
    } catch (error: any) {
      return { success: false, error: 'Transaction invalide' };
    }
  },

  handleWebhook: (payload: any, signature: string) => {
    try {
      const event = payload;
      let transaction = event.entity || event.data || event;
      
      // Si la transaction est dans une clé 'v1/transaction'
      if (event['v1/transaction']) {
        transaction = event['v1/transaction'];
      }
      
      const status = transaction.status || event.status;
      
      // Vérifier si la transaction est approuvée
      if (status === 'approved' || status === 'paid' || status === 'success') {
        // Récupérer le userId depuis les métadonnées ou le customer
        let userId = transaction.metadata?.userId;
        
        // Si pas dans metadata, essayer de récupérer depuis le customer
        if (!userId && transaction.customer) {
          // On peut essayer de trouver l'utilisateur par email
          const email = transaction.customer.email;
          const users = dataService.getUsers();
          const user = users.find(u => u.email === email);
          if (user) {
            userId = user.id;
          }
        }
        
        if (!userId) {
          console.error('userId non trouvé pour la transaction');
          return { success: false, error: 'userId non trouvé' };
        }
  
        return { success: true, userId, transaction };
      }
  
      return { success: true, event };
    } catch (error: any) {
      console.error('Erreur webhook:', error);
      return { success: false, error: error.message };
    }
  },
};