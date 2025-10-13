import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        showNotification('Successfully signed in', 'success');
        onClose();
      } else {
        await signUpWithEmail(email, password);
        showNotification('Account created! Check your email to confirm', 'success');
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
      await signIn();
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign-in failed';
      showNotification(msg, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-black bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-black bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M44.5 20H24V28.5H35.7C34.3 32.1 30.7 34.5 26.5 34.5C21.3 34.5 17 30.2 17 25C17 19.8 21.3 15.5 26.5 15.5C28.7 15.5 30.7 16.3 32.2 17.6L37.1 12.7C34.1 10.1 30.5 8.5 26.5 8.5C16.7 8.5 8.5 16.7 8.5 26.5C8.5 36.3 16.7 44.5 26.5 44.5C36.3 44.5 44.5 36.3 44.5 26.5C44.5 24.9 44.4 23.4 44.1 22H44.5V20Z" fill="#4285F4"/><path d="M24 44.5C30.7 44.5 36.3 40.2 38.7 34.5L30.7 28.5C29.5 30.7 27.1 32.1 24 32.1C20.9 32.1 18.5 30.7 17.3 28.5L9.3 34.5C11.7 40.2 17.3 44.5 24 44.5Z" fill="#34A853"/><path d="M38.7 34.5C40.1 32.1 41 29.1 41 26.5C41 23.9 40.1 20.9 38.7 18.5L30.7 24.5C31.1 25.3 31.3 26.1 31.3 26.9C31.3 27.7 31.1 28.5 30.7 29.3L38.7 34.5Z" fill="#FBBC05"/><path d="M17.3 28.5C16.9 27.7 16.7 26.9 16.7 26.1C16.7 25.3 16.9 24.5 17.3 23.7L9.3 18.5C7.9 20.9 7 23.9 7 26.5C7 29.1 7.9 32.1 9.3 34.5L17.3 28.5Z" fill="#EA4335"/></g></svg>
              Continue with Google
            </button>
          </div>

          {/* Toggle Mode */}
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;