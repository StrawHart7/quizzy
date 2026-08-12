import axios from 'axios';
import { Request, Response } from 'express';
import { fedapayService } from '../services/fedapayService';
import dataService from '../services/dataService';

export const paymentController = {
  // Tester la connexion FedaPay
  test: async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.FEDAPAY_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ 
          success: false, 
          error: 'FEDAPAY_API_KEY non définie'
        });
      }

      const testResponse = await axios.get(
        'https://sandbox-api.fedapay.com/v1/transactions?limit=1',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.json({ 
        success: true, 
        message: 'FedaPay configuré correctement',
        data: testResponse.data
      });
    } catch (error: any) {
      console.error('❌ Erreur test FedaPay:', error.response?.data || error.message);
      res.status(500).json({ 
        success: false, 
        error: error.response?.data?.message || error.message,
      });
    }
  },

  createTransaction: async (req: Request, res: Response) => {
    try {
      console.log('📝 createTransaction appelé');
      console.log('👤 Utilisateur:', req.user);
      
      const userId = req.user?.id;
      const email = req.user?.email;
      const username = req.user?.username;

      if (!userId) {
        console.error('❌ Utilisateur non authentifié');
        return res.status(401).json({ success: false, error: 'Utilisateur non authentifié' });
      }

      console.log('📧 Email:', email);
      console.log('👤 Username:', username);

      const user = dataService.getUser(userId);
      if (user?.role === 'teacher' || user?.role === 'admin') {
        return res.status(400).json({
          success: false,
          error: 'Vous êtes déjà enseignant ou administrateur'
        });
      }

      const result = await fedapayService.createTransactionToken(userId, email || '', username || '');
      
      console.log('📦 Résultat FedaPayService:', JSON.stringify(result, null, 2));

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId
      });
    } catch (error: any) {
      console.error('❌ Erreur createTransaction:', error);
      res.status(500).json({ success: false, error: error.message || 'Erreur interne du serveur' });
    }
  },

  verifyTransaction: async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return res.status(400).json({ success: false, error: 'ID de transaction requis' });
      }

      const result = await fedapayService.verifyTransaction(transactionId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || 'Transaction non valide',
          status: result.status || 'unknown'
        });
      }

      const transaction = result.transaction;

      if (transaction.status !== 'paid' && transaction.status !== 'success') {
        return res.status(400).json({
          success: false,
          error: 'Le paiement n\'a pas été confirmé',
          status: transaction.status
        });
      }

      const userId = transaction.metadata?.userId || transaction.customer?.metadata?.userId;

      if (userId) {
        const user = dataService.getUser(userId);
        if (user && user.role === 'student') {
          dataService.updateUserRole(userId, 'teacher');
          console.log(`✅ Utilisateur ${user.username} promu enseignant`);
        }
      }

      res.json({
        success: true,
        data: {
          status: transaction.status,
          userId,
          role: 'teacher'
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur verifyTransaction:', error);
      res.status(500).json({ success: false, error: error.message || 'Erreur interne' });
    }
  },

  webhook: async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      
      const result = fedapayService.handleWebhook(payload, '');
  
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }
  
      if (result.userId) {
        const user = dataService.getUser(result.userId);
        if (user && user.role === 'student') {
          dataService.updateUserRole(result.userId, 'teacher');
          console.log(`Utilisateur ${user.username} promu enseignant`);
        }
      }
  
      res.json({ success: true, received: true });
    } catch (error: any) {
      console.error('Erreur webhook:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTeacherStatus: (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Non authentifié' });
      }

      const user = dataService.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        data: {
          isTeacher: user.role === 'teacher' || user.role === 'admin',
          role: user.role
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur getTeacherStatus:', error);
      res.status(500).json({ success: false, error: error.message || 'Erreur interne' });
    }
  }
};