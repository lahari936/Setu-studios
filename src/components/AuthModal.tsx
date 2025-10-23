import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthSetupGuide from './AuthSetupGuide';

// Conditionally import LinkedIn component to prevent errors
let LinkedInLogin: any = null;
try {
  LinkedInLogin = require('react-linkedin-login-oauth2').default;
} catch (error) {
  console.warn('LinkedIn OAuth not available:', error);
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { signInWithGoogle, signInWithLinkedIn, signInWithEmail, signUpWithEmail } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);

  // Check if Firebase is configured
  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        // Success notification is already handled in AuthContext
        onClose();
      } else {
        await signUpWithEmail(email, password);
        // Success notification is already handled in AuthContext
        onClose();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Authentication failed';
      showNotification(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      // Note: OAuth redirects will close the modal automatically
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign-in failed';
      showNotification(msg, 'error');
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInSuccess = async (response: any) => {
    try {
      setIsLinkedInLoading(true);
      await signInWithLinkedIn(response.access_token);
      // Note: OAuth redirects will close the modal automatically
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'LinkedIn sign-in failed';
      showNotification(msg, 'error');
      setIsLinkedInLoading(false);
    }
  };

  const handleLinkedInFailure = (error: any) => {
    console.error('LinkedIn sign-in failed:', error);
    showNotification('LinkedIn sign-in failed. Please try again.', 'error');
    setIsLinkedInLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 pt-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? 'Sign in to your account' : 'Join Setu Studios today'}
            </p>
          </div>

          {/* Show setup guide if authentication is not configured */}
          {!isFirebaseConfigured && (
            <div className="mb-6">
              <AuthSetupGuide />
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={!isFirebaseConfigured || isGoogleLoading || isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>

            {LinkedInLogin && import.meta.env.VITE_LINKEDIN_CLIENT_ID ? (
              <LinkedInLogin
                clientId={import.meta.env.VITE_LINKEDIN_CLIENT_ID}
                onSuccess={handleLinkedInSuccess}
                onFailure={handleLinkedInFailure}
                redirectUri={`${window.location.origin}/linkedin-callback`}
                scope="openid profile email"
                className="w-full"
              >
                <button
                  type="button"
                  disabled={!isFirebaseConfigured || isLinkedInLoading || isLoading}
                  className="w-full py-3 px-4 rounded-lg font-semibold bg-[#0077B5] text-white flex items-center justify-center gap-3 hover:bg-[#005885] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLinkedInLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  Continue with LinkedIn
                </button>
              </LinkedInLogin>
            ) : (
              <button
                type="button"
                disabled={true}
                className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-300 text-gray-500 flex items-center justify-center gap-3 cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn (Configure to enable)
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFirebaseConfigured || isLoading}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;