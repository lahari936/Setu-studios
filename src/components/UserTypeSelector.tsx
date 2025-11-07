import React, { useState } from 'react';
import { User, Users, Lightbulb, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export type UserType = 'founder' | 'mentor' | 'early-stage';

interface UserTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onUserTypeSelected: (userType: UserType) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  isOpen,
  onClose,
  onUserTypeSelected
}) => {
  const { isDark } = useTheme();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const userTypes = [
    {
      id: 'founder' as UserType,
      title: 'Founder',
      description: 'I\'m building a startup and need guidance',
      icon: User,
      color: 'from-orange-500 to-red-500',
      features: [
        'Access to expert mentors',
        'Startup resources & templates',
        'Networking opportunities',
        'Funding guidance'
      ]
    },
    {
      id: 'mentor' as UserType,
      title: 'Mentor',
      description: 'I want to share my expertise and help others',
      icon: Users,
      color: 'from-blue-500 to-purple-500',
      features: [
        'Connect with founders',
        'Share your expertise',
        'Build your network',
        'Earn recognition'
      ]
    },
    {
      id: 'early-stage' as UserType,
      title: 'Early Stage',
      description: 'I\'m exploring entrepreneurship and need support',
      icon: Lightbulb,
      color: 'from-green-500 to-teal-500',
      features: [
        'Learning resources',
        'Idea validation tools',
        'Mentor matching',
        'Community support'
      ]
    }
  ];

  const handleSelect = (userType: UserType) => {
    setSelectedType(userType);
  };

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelected(selectedType);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
          isDark ? 'bg-slate-900' : 'bg-white'
        } shadow-2xl`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Setu Studios!
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Tell us about yourself to get the best experience
            </p>
          </div>

          {/* User Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(type.id)}
                  className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {type.title}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {type.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserTypeSelector;
