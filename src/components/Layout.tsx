import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowUp, ShoppingCart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/useAuth';
import { useSmoothNavigation } from '../hooks/useSmoothNavigation';
import AIChatbot from './AIChatbot';
import AuthModal from './AuthModal';
import ProfileDropdown from './ProfileDropdown';
import EnquiryModal from './EnquiryModal';
import logoImage from '/logo.jpg';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const { smoothNavigate, isNavigating } = useSmoothNavigation();

  const cartCount = getItemCount();
  const { user, userProfile, loading, signOut } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Idea Analyzer', path: '/idea-analyzer' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
    }`}>
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark ? 'bg-slate-900/95' : 'bg-white/95'
      } backdrop-blur-sm border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
               <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                 <img 
                   src={logoImage} 
                   alt="Setu Studios Logo" 
                   className="w-full h-full object-cover scale-150"
                 />
               </div>
              <span className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                Setu Studios
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => smoothNavigate(item.path)}
                  disabled={isNavigating}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-orange-500 disabled:opacity-50 ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-500/10'
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Enquiry Button */}
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="px-3 py-2 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                Get Quote
              </button>

              {/* Auth buttons */}
              {!loading && !user && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="px-3 py-2 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}

              {!loading && user && (
                <ProfileDropdown 
                  user={user} 
                  userProfile={userProfile} 
                  isDark={isDark} 
                />
              )}
              
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500"
              >
                <ShoppingCart size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500"
              >
                <ShoppingCart size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className={`px-2 pt-2 pb-3 space-y-1 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      smoothNavigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    disabled={isNavigating}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 disabled:opacity-50 ${
                      isActive(item.path)
                        ? 'text-orange-500 bg-orange-500/10'
                        : isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                {/* Mobile Enquiry Button */}
                <div className="px-3 py-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setEnquiryModalOpen(true);
                    }}
                    className="w-full py-2 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Get Quote
                  </button>
                </div>

                {/* Mobile Auth Buttons */}
                {!loading && !user && (
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleAuthClick('login');
                      }}
                      className="w-full py-2 rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleAuthClick('signup');
                      }}
                      className="w-full py-2 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                )}
                {!loading && user && (
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Profile Picture with fallback */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div>Signed in as</div>
                        <div className="font-medium">
                          {user.displayName || user.email?.split('@')[0] || user.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link 
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full py-2 px-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full py-2 px-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Settings
                      </Link>
                    </div>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full py-2 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className={`border-t ${
        isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 Setu Studios. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-110 z-40"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
};

export default Layout;