import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Award, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedSignupForm from './EnhancedSignupForm';
import ProfileSummary from './ProfileSummary';

const SignupDemo: React.FC = () => {
  const { isDark } = useTheme();
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showProfileSummary, setShowProfileSummary] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const handleProfileComplete = (data: any) => {
    setProfileData(data);
    setShowSignupForm(false);
    setShowProfileSummary(true);
  };

  const handleProfileEdit = () => {
    setShowProfileSummary(false);
    setShowSignupForm(true);
  };

  const handleProfileFinalComplete = () => {
    setShowProfileSummary(false);
  };

  if (showSignupForm) {
    return (
      <EnhancedSignupForm
        onComplete={handleProfileComplete}
        onClose={() => setShowSignupForm(false)}
      />
    );
  }

  if (showProfileSummary && profileData) {
    return (
      <ProfileSummary
        profileData={profileData}
        onEdit={handleProfileEdit}
        onComplete={handleProfileFinalComplete}
      />
    );
  }

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-2xl">
              <UserPlus size={56} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            Enhanced Signup Experience
          </h1>
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience our new interactive signup process with personalized badges, 
            role-based questions, and profile customization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="modern-card p-8 text-center"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserPlus size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text-blue">17 Questions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive questions covering your role, stage, skills, and startup journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="modern-card p-8 text-center"
          >
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text-purple">Smart Badges</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically generated badges based on your role, stage, and personality
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="modern-card p-8 text-center"
          >
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Personalized Profile</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your profile is customized based on your answers and preferences
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => setShowSignupForm(true)}
            className="btn-primary px-12 py-4 text-lg"
          >
            Try Enhanced Signup
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupDemo;
