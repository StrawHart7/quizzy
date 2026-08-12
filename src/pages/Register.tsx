import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const success = await register(username, email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Cet email est déjà utilisé');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card title="Inscription">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="JohnDoe"
              icon={<User className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (min. 6 caractères)"
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              required
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" icon={<UserPlus className="w-4 h-4" />}>
              S'inscrire
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-[#8888a0]">
              Déjà un compte ?{' '}
              <a href="/login" className="text-blue-600 hover:underline flex items-center justify-center space-x-1">
                <LogIn className="w-3 h-3" />
                <span>Se connecter</span>
              </a>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
};