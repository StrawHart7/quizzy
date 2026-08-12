import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card title="Connexion">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              required
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" icon={<LogIn className="w-4 h-4" />}>
              Se connecter
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-[#8888a0]">
              Pas encore de compte ?{' '}
              <a href="/register" className="text-blue-600 hover:underline flex items-center justify-center space-x-1">
                <UserPlus className="w-3 h-3" />
                <span>S'inscrire</span>
              </a>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
};