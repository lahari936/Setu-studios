import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithLinkedIn } = useAuth();
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing LinkedIn authentication...');

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'LinkedIn authentication failed');
          showNotification('LinkedIn authentication failed', 'error');
          
          // Redirect to home after 3 seconds
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received from LinkedIn');
          showNotification('Authentication failed: No authorization code', 'error');
          
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Exchange code for access token
        const tokenResponse = await fetch('/api/linkedin/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        
        // Sign in with the access token
        await signInWithLinkedIn(tokenData.access_token);
        
        setStatus('success');
        setMessage('Successfully authenticated with LinkedIn!');
        showNotification('Successfully signed in with LinkedIn', 'success');
        
        // Redirect to home after 2 seconds
        setTimeout(() => navigate('/'), 2000);
        
      } catch (error) {
        console.error('LinkedIn callback error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication');
        showNotification('Authentication failed', 'error');
        
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleLinkedInCallback();
  }, [searchParams, navigate, signInWithLinkedIn, showNotification]);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="max-w-md w-full mx-4">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center transition-colors duration-300`}>
          <div className="mb-6">
            {status === 'loading' && (
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>
          
          {status === 'loading' && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we complete your authentication...
              </p>
            </div>
          )}
          
          {(status === 'success' || status === 'error') && (
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Continue to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
