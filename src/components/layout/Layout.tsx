import React from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        username={user?.username || ''}
        onLogout={logout}
      />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};