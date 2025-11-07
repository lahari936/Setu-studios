import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const MentorVerification: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyMentor(token);
  }, [searchParams]);

  const verifyMentor = async (token: string) => {
    try {
      const response = await fetch(`/api/mentors/verify/${token}`, {
        method: 'GET',
      });

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('Mentor verified successfully! Your profile is now live on the platform.');
      } else {
        const error = await response.json();
        setVerificationStatus('error');
        setMessage(error.message || 'Failed to verify mentor. The token may be invalid or expired.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage('Network error occurred. Please try again later.');
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'text-orange-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'bg-orange-50 dark:bg-orange-900/20';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="max-w-md w-full">
        <div className={`${getStatusBg()} rounded-xl p-8 text-center`}>
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {verificationStatus === 'loading' && 'Verifying Mentor...'}
            {verificationStatus === 'success' && 'Verification Successful!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your mentor profile is now visible to users on the platform. 
                You can expect to receive booking requests from potential mentees.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/mentorship')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  View Mentorship Page
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you believe this is an error, please contact our support team 
                or try applying again through the mentorship page.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/mentorship')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'loading' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we verify your mentor application...
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorVerification;
