import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, LogIn, UserPlus, LogOut, 
  BookOpen, BarChart3, Trophy, Home, Settings,
  Menu, X, Crown, Shield, Users
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false, 
  username = '',
  onLogout 
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, isTeacher, user } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-[#1e1e3a] shadow-sm border-b border-gray-200 dark:border-[#2a2a4a] sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <div className="p-2 bg-[#4f46e5]/10 dark:bg-[#818cf8]/10 rounded-lg group-hover:bg-[#4f46e5]/20 dark:group-hover:bg-[#818cf8]/20 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-[#4f46e5] dark:text-[#818cf8]" />
            </div>
            <div>
              <span className="text-xl font-bold text-[#4f46e5] dark:text-[#818cf8]">Quiz L2</span>
              <span className="text-xs text-[#94a3b8] dark:text-[#6b6b85] hidden sm:block">
                Moteur de quiz interactif
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/quizzes" 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Quiz</span>
                </Link>
                <Link 
                  to="/scores" 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Scores</span>
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Classement</span>
                </Link>
                
                {/* Devenir enseignant - visible si student */}
                {!isTeacher && !isAdmin && user?.role === 'student' && (
                  <Link 
                    to="/upgrade" 
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Devenir enseignant</span>
                  </Link>
                )}
                
                {/* Admin - visible si admin ou teacher */}
                {(isAdmin || isTeacher) && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* Gestion utilisateurs - visible si admin uniquement */}
                {isAdmin && (
                  <Link 
                    to="/users" 
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    <span>Utilisateurs</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-[#2a2a4a] pl-4 ml-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-[#0f172a] dark:text-[#e8e8f0] hidden lg:inline">
                        {username}
                      </span>
                      {isAdmin && (
                        <Shield className="w-3 h-3 text-[#4f46e5] dark:text-[#818cf8]" />
                      )}
                      {isTeacher && !isAdmin && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[#64748b] dark:text-[#b0b0c8] hover:text-[#4f46e5] dark:hover:text-[#818cf8] hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-all duration-200 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Inscription</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#64748b] dark:text-[#b0b0c8]" />
              ) : (
                <Menu className="w-6 h-6 text-[#64748b] dark:text-[#b0b0c8]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-[#2a2a4a] animate-slide-down">
            <div className="flex flex-col space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-3 mb-2 bg-[#f8fafc] dark:bg-[#1a1a2e] rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-semibold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0f172a] dark:text-[#e8e8f0] flex items-center">
                        {username}
                        {isAdmin && (
                          <Shield className="w-3 h-3 ml-1 text-[#4f46e5] dark:text-[#818cf8]" />
                        )}
                        {isTeacher && !isAdmin && (
                          <Crown className="w-3 h-3 ml-1 text-yellow-500" />
                        )}
                      </p>
                      <p className="text-xs text-[#94a3b8] dark:text-[#6b6b85]">
                        {isAdmin ? 'Administrateur' : isTeacher ? 'Enseignant' : 'Étudiant'}
                      </p>
                    </div>
                  </div>

                  <Link 
                    to="/dashboard" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                  >
                    <Home className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                    <span className="text-[#0f172a] dark:text-[#e8e8f0]">Dashboard</span>
                  </Link>
                  <Link 
                    to="/quizzes" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                    <span className="text-[#0f172a] dark:text-[#e8e8f0]">Quiz</span>
                  </Link>
                  <Link 
                    to="/scores" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                    <span className="text-[#0f172a] dark:text-[#e8e8f0]">Scores</span>
                  </Link>
                  <Link 
                    to="/leaderboard" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                  >
                    <Trophy className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                    <span className="text-[#0f172a] dark:text-[#e8e8f0]">Classement</span>
                  </Link>
                  
                  {!isTeacher && !isAdmin && user?.role === 'student' && (
                    <Link 
                      to="/upgrade" 
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Devenir enseignant</span>
                    </Link>
                  )}
                  
                  {(isAdmin || isTeacher) && (
                    <Link 
                      to="/admin" 
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                    >
                      <Settings className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                      <span className="text-[#0f172a] dark:text-[#e8e8f0]">Admin</span>
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Link 
                      to="/users" 
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                    >
                      <Users className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                      <span className="text-[#0f172a] dark:text-[#e8e8f0]">Utilisateurs</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left mt-2 border-t border-gray-200 dark:border-[#2a2a4a] pt-3"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2a2a4a] transition-colors"
                  >
                    <LogIn className="w-5 h-5 text-[#64748b] dark:text-[#b0b0c8]" />
                    <span className="text-[#0f172a] dark:text-[#e8e8f0]">Connexion</span>
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Inscription</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};