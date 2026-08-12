import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dataService from '../services/dataService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const authController = {
  // Inscription - toujours en tant qu'étudiant
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = dataService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Un utilisateur avec cet email existe déjà' 
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur avec le rôle 'student' par défaut
      const newUser = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        role: 'student' as const,
        createdAt: new Date()
      };

      dataService.addUser(newUser);

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Erreur register:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de l\'inscription' });
    }
  },

  // Connexion
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = dataService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la connexion' });
    }
  },

  // Get current user
  getMe: (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, error: 'Non authentifié' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Erreur getMe:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  },

  // Get all users - accessible à tous les utilisateurs authentifiés
  getAllUsers: (req: Request, res: Response) => {
    try {
      // Supprimer la vérification admin - tout utilisateur authentifié peut voir la liste
      // if (req.user?.role !== 'admin') {
      //   return res.status(403).json({ success: false, error: 'Accès non autorisé' });
      // }
      
      const users = dataService.getUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ success: true, data: usersWithoutPasswords });
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  // Update user role (admin only)
  updateUserRole: (req: Request, res: Response) => {
    try {
      // Vérifier si l'utilisateur est admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Accès non autorisé' });
      }

      const { userId } = req.params;
      const { role } = req.body;

      // Vérifier que le rôle est valide
      if (!['admin', 'teacher', 'student'].includes(role)) {
        return res.status(400).json({ success: false, error: 'Rôle invalide' });
      }

      // Ne pas pouvoir changer son propre rôle
      if (userId === req.user.id) {
        return res.status(400).json({ success: false, error: 'Vous ne pouvez pas modifier votre propre rôle' });
      }

      const users = dataService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      }

      users[userIndex].role = role as 'admin' | 'teacher' | 'student';
      dataService.saveUsers(users);

      const { password, ...userWithoutPassword } = users[userIndex];
      res.json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error('Erreur updateUserRole:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du rôle' });
    }
  },

  // Delete user (admin only)
  deleteUser: (req: Request, res: Response) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Accès non autorisé' });
      }

      const { userId } = req.params;

      if (userId === req.user.id) {
        return res.status(400).json({ success: false, error: 'Vous ne pouvez pas supprimer votre propre compte' });
      }

      const users = dataService.getUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      
      if (filteredUsers.length === users.length) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      }

      dataService.saveUsers(filteredUsers);
      res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression' });
    }
  },

  // Create user with specific role (admin only)
  createUser: async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Accès non autorisé' });
      }

      const { username, email, password, role } = req.body;

      if (!['admin', 'teacher', 'student'].includes(role)) {
        return res.status(400).json({ success: false, error: 'Rôle invalide' });
      }

      const existingUser = dataService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        role: role as 'admin' | 'teacher' | 'student',
        createdAt: new Date()
      };

      dataService.addUser(newUser);
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error('Erreur createUser:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la création' });
    }
  }
};