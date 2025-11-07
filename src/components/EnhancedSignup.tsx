import React, { useState } from 'react';
import { 
  User, 
  Rocket, 
  Users, 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Lightbulb
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from './AnimatedCard';

interface SignupData {
  role: string;
  startupStage: string;
  industry: string;
  goal: string;
  name: string;
  email: string;
  experience: string;
  interests: string[];
}

interface Badge {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const EnhancedSignup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    role: '',
    startupStage: '',
    industry: '',
    goal: '',
    name: '',
    email: '',
    experience: '',
    interests: []
  });

  const steps = [
    {
      title: 'Welcome to Setu Studios',
      subtitle: 'Let\'s get to know you better',
      icon: Sparkles
    },
    {
      title: 'What\'s your role?',
      subtitle: 'Tell us about your entrepreneurial journey',
      icon: User
    },
    {
      title: 'Startup Stage',
      subtitle: 'Where are you in your startup journey?',
      icon: Rocket
    },
    {
      title: 'Industry Focus',
      subtitle: 'What domain are you working in?',
      icon: Target
    },
    {
      title: 'Your Goals',
      subtitle: 'What do you want to achieve?',
      icon: TrendingUp
    },
    {
      title: 'Personal Details',
      subtitle: 'Let\'s get your contact information',
      icon: User
    },
    {
      title: 'Interests & Skills',
      subtitle: 'Help us personalize your experience',
      icon: Lightbulb
    }
  ];

  const roles = [
    { id: 'founder', name: 'Founder', icon: Rocket, description: 'Building my own startup' },
    { id: 'co-founder', name: 'Co-Founder', icon: Users, description: 'Looking for a co-founder' },
    { id: 'mentor', name: 'Mentor', icon: Brain, description: 'Helping others succeed' }
  ];

  const startupStages = [
    { id: 'idea', name: 'Idea Stage', description: 'Just starting with an idea' },
    { id: 'prototype', name: 'Prototype', description: 'Building initial version' },
    { id: 'mvp', name: 'MVP', description: 'Minimum viable product ready' },
    { id: 'scaling', name: 'Scaling', description: 'Growing and expanding' }
  ];

  const industries = [
    'EdTech', 'FinTech', 'HealthTech', 'AI/ML', 'SaaS', 'E-commerce', 
    'Blockchain', 'IoT', 'Cybersecurity', 'Gaming', 'Social Media', 'Other'
  ];

  const goals = [
    { id: 'cofounder', name: 'Find Co-founder', description: 'Looking for the right partner' },
    { id: 'mentorship', name: 'Get Mentorship', description: 'Seek guidance and advice' },
    { id: 'funding', name: 'Seek Funding', description: 'Raise capital for growth' },
    { id: 'ideas', name: 'Explore Ideas', description: 'Validate and develop concepts' }
  ];

  const interestTags = [
    'AI', 'SaaS', 'Blockchain', 'Marketing', 'Product Design', 'Development',
    'Sales', 'Finance', 'Operations', 'Strategy', 'UX/UI', 'Data Science'
  ];

  const getBadges = (): Badge[] => {
    const badges: Badge[] = [];
    
    if (signupData.role === 'mentor') {
      badges.push({
        id: 'mentor',
        name: '🧠 Mentor',
        icon: Brain,
        color: 'from-orange-500 to-orange-600',
        description: 'Experienced advisor'
      });
    }
    
    if (signupData.role === 'founder') {
      badges.push({
        id: 'founder',
        name: '🚀 Founder',
        icon: Rocket,
        color: 'from-orange-500 to-orange-600',
        description: 'Startup founder'
      });
    }
    
    if (signupData.role === 'co-founder') {
      badges.push({
        id: 'cofounder',
        name: '🤝 Co-founder',
        icon: Users,
        color: 'from-green-500 to-green-600',
        description: 'Looking for partnership'
      });
    }
    
    if (signupData.startupStage === 'idea') {
      badges.push({
        id: 'early-stage',
        name: '🌱 Early Stage',
        icon: Lightbulb,
        color: 'from-purple-500 to-purple-600',
        description: 'Early stage entrepreneur'
      });
    }
    
    return badges;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data
      const userProfile = {
        ...signupData,
        badges: getBadges(),
        joinedAt: new Date().toISOString(),
        profileCompleteness: 85
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      showNotification('Welcome to Setu Studios! Your profile has been created.', 'success');
      onClose();
      
      // Reset form
      setCurrentStep(0);
      setSignupData({
        role: '',
        startupStage: '',
        industry: '',
        goal: '',
        name: '',
        email: '',
        experience: '',
        interests: []
      });
      
    } catch (error) {
      showNotification('Failed to create profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center animate-pulse">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text">Welcome to Setu Studios</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your AI-powered startup journey begins here. Let's create your personalized experience.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 bg-sarbuzz-primary rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">What's your role?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSignupData({ ...signupData, role: role.id })}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    signupData.role === role.id
                      ? 'border-sarbuzz-primary bg-sarbuzz-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sarbuzz-primary'
                  }`}
                >
                  <role.icon size={32} className="mx-auto mb-3 text-sarbuzz-primary" />
                  <h4 className="font-semibold text-lg">{role.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Startup Stage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startupStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setSignupData({ ...signupData, startupStage: stage.id })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    signupData.startupStage === stage.id
                      ? 'border-sarbuzz-primary bg-sarbuzz-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sarbuzz-primary'
                  }`}
                >
                  <h4 className="font-semibold text-lg">{stage.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Industry Focus</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSignupData({ ...signupData, industry })}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    signupData.industry === industry
                      ? 'border-sarbuzz-primary bg-sarbuzz-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sarbuzz-primary'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSignupData({ ...signupData, goal: goal.id })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    signupData.goal === goal.id
                      ? 'border-sarbuzz-primary bg-sarbuzz-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sarbuzz-primary'
                  }`}
                >
                  <h4 className="font-semibold text-lg">{goal.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <select
                  value={signupData.experience}
                  onChange={(e) => setSignupData({ ...signupData, experience: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Interests & Skills</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Select your areas of interest to get personalized recommendations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const newInterests = signupData.interests.includes(tag)
                      ? signupData.interests.filter(i => i !== tag)
                      : [...signupData.interests, tag];
                    setSignupData({ ...signupData, interests: newInterests });
                  }}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    signupData.interests.includes(tag)
                      ? 'border-sarbuzz-primary bg-sarbuzz-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sarbuzz-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Show badges preview */}
            {getBadges().length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-sarbuzz-primary/10 to-sarbuzz-secondary/10 rounded-xl">
                <h4 className="font-semibold text-lg mb-4 text-center">Your Badges</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {getBadges().map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                      <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                      <span className="font-medium">{badge.name.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border-2 ${
        isDark ? 'bg-slate-900 border-sarbuzz-primary' : 'bg-white border-sarbuzz-primary'
      } p-8 relative animate-fadeIn`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentStep + 1}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{steps[currentStep].subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <ArrowLeft size={20} className="inline mr-2" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Profile...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle size={20} className="inline mr-2" />
                  Complete Setup
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300"
            >
              Next
              <ArrowRight size={20} className="inline ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignup;
