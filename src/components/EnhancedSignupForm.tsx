import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Star, 
  Rocket, 
  Users, 
  Lightbulb,
  Target,
  Zap,
  Heart,
  TrendingUp,
  Code,
  Palette,
  DollarSign,
  Settings,
  MessageCircle,
  Calendar,
  Award,
  Shield,
  Crown,
  Flame,
  Brain,
  Compass,
  X,
  Clock,
  User
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

interface FormData {
  role: string;
  stage: string;
  industry: string;
  incubation: string;
  ideaPitch: string;
  roadblock: string;
  timeline: string;
  needs: string[];
  keywordExecution: string;
  superpower: string;
  confidence: number;
  workStyle: string;
  motivation: string;
  vibeBadge: string;
  skills: string[];
  collaboration: string;
  hackathonInterest: string;
  badges: string[];
}

interface BadgeConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  conditions: (data: FormData) => boolean;
}

const badgeConfigs: BadgeConfig[] = [
  {
    id: 'founder',
    name: 'Founder',
    icon: Crown,
    color: 'from-yellow-400 to-orange-500',
    description: 'Leading the vision and execution',
    conditions: (data) => data.role === 'Founder'
  },
  {
    id: 'co-founder',
    name: 'Co-Founder',
    icon: Users,
    color: 'from-blue-400 to-purple-500',
    description: 'Building together, stronger together',
    conditions: (data) => data.role === 'Co-Founder'
  },
  {
    id: 'mentor',
    name: 'Mentor',
    icon: Heart,
    color: 'from-green-400 to-teal-500',
    description: 'Guiding the next generation',
    conditions: (data) => data.role === 'Mentor'
  },
  {
    id: 'investor',
    name: 'Investor',
    icon: DollarSign,
    color: 'from-emerald-400 to-green-500',
    description: 'Fueling innovation with capital',
    conditions: (data) => data.role === 'Investor'
  },
  {
    id: 'early-innovator',
    name: 'Early Innovator',
    icon: Lightbulb,
    color: 'from-pink-400 to-rose-500',
    description: 'Pioneering the future',
    conditions: (data) => data.role === 'Early-stage Innovator'
  },
  {
    id: 'team-member',
    name: 'Team Player',
    icon: Users,
    color: 'from-indigo-400 to-blue-500',
    description: 'Collaborative builder',
    conditions: (data) => data.role === 'Team Member/Collaborator'
  },
  {
    id: 'idea-stage',
    name: 'Idea Stage',
    icon: Lightbulb,
    color: 'from-yellow-300 to-orange-400',
    description: 'Conceptualizing the future',
    conditions: (data) => data.stage === 'Idea Stage'
  },
  {
    id: 'mvp-ready',
    name: 'MVP Ready',
    icon: Rocket,
    color: 'from-blue-400 to-cyan-500',
    description: 'Ready to launch',
    conditions: (data) => data.stage === 'MVP Ready'
  },
  {
    id: 'early-traction',
    name: 'Early Traction',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    description: 'Gaining momentum',
    conditions: (data) => data.stage === 'Early Traction'
  },
  {
    id: 'scaling',
    name: 'Scaling',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
    description: 'Growing fast',
    conditions: (data) => data.stage === 'Scaling'
  },
  {
    id: 'visionary',
    name: 'Visionary',
    icon: Compass,
    color: 'from-indigo-400 to-purple-500',
    description: 'Seeing the big picture',
    conditions: (data) => data.vibeBadge === 'Visionary'
  },
  {
    id: 'doer',
    name: 'Doer',
    icon: Target,
    color: 'from-red-400 to-orange-500',
    description: 'Getting things done',
    conditions: (data) => data.vibeBadge === 'Doer'
  },
  {
    id: 'collaborator',
    name: 'Collaborator',
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
    description: 'Building together',
    conditions: (data) => data.vibeBadge === 'Collaborator'
  },
  {
    id: 'hustler',
    name: 'Hustler',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    description: 'Relentless execution',
    conditions: (data) => data.vibeBadge === 'Hustler'
  },
  {
    id: 'strategist',
    name: 'Strategist',
    icon: Brain,
    color: 'from-purple-400 to-indigo-500',
    description: 'Strategic thinking',
    conditions: (data) => data.vibeBadge === 'Strategist'
  }
];

const questions = [
  {
    id: 'role',
    question: 'What best describes your current role?',
    type: 'single',
    options: [
      { value: 'Founder', label: 'Founder', icon: Crown },
      { value: 'Co-Founder', label: 'Co-Founder', icon: Users },
      { value: 'Mentor', label: 'Mentor', icon: Heart },
      { value: 'Investor', label: 'Investor', icon: DollarSign },
      { value: 'Early-stage Innovator', label: 'Early-stage Innovator', icon: Lightbulb },
      { value: 'Team Member/Collaborator', label: 'Team Member/Collaborator', icon: Users }
    ]
  },
  {
    id: 'stage',
    question: 'If you\'re a founder — what stage is your startup currently in?',
    type: 'single',
    options: [
      { value: 'Idea Stage', label: 'Idea Stage', icon: Lightbulb },
      { value: 'MVP Ready', label: 'MVP Ready', icon: Rocket },
      { value: 'Early Traction', label: 'Early Traction', icon: TrendingUp },
      { value: 'Scaling', label: 'Scaling', icon: Zap }
    ],
    conditional: (data: FormData) => data.role === 'Founder' || data.role === 'Co-Founder'
  },
  {
    id: 'industry',
    question: 'What industry or domain are you working on?',
    type: 'single',
    options: [
      { value: 'AI/Tech', label: 'AI/Tech', icon: Code },
      { value: 'HealthTech', label: 'HealthTech', icon: Heart },
      { value: 'FinTech', label: 'FinTech', icon: DollarSign },
      { value: 'EdTech', label: 'EdTech', icon: Lightbulb },
      { value: 'Climate/Sustainability', label: 'Climate/Sustainability', icon: Shield },
      { value: 'Other', label: 'Other', icon: Settings }
    ]
  },
  {
    id: 'incubation',
    question: 'Are you currently part of any startup or incubation program?',
    type: 'single',
    options: [
      { value: 'Yes', label: 'Yes', icon: CheckCircle },
      { value: 'No', label: 'No', icon: X }
    ]
  },
  {
    id: 'ideaPitch',
    question: 'Describe your idea in one sentence.',
    type: 'text',
    placeholder: 'Tell us about your startup idea...'
  },
  {
    id: 'roadblock',
    question: 'What is the biggest roadblock you\'re currently facing?',
    type: 'single',
    options: [
      { value: 'Finding teammates', label: 'Finding teammates', icon: Users },
      { value: 'Building MVP', label: 'Building MVP', icon: Code },
      { value: 'Getting funding', label: 'Getting funding', icon: DollarSign },
      { value: 'Validating idea', label: 'Validating idea', icon: Target },
      { value: 'Finding mentors', label: 'Finding mentors', icon: Heart },
      { value: 'Scaling operations', label: 'Scaling operations', icon: TrendingUp }
    ]
  },
  {
    id: 'timeline',
    question: 'How soon are you planning to launch your product?',
    type: 'single',
    options: [
      { value: 'Within 3 months', label: 'Within 3 months', icon: Zap },
      { value: '3–6 months', label: '3–6 months', icon: Calendar },
      { value: '6–12 months', label: '6–12 months', icon: Calendar },
      { value: 'Just exploring ideas right now', label: 'Just exploring ideas right now', icon: Lightbulb }
    ]
  },
  {
    id: 'needs',
    question: 'What kind of help or resources would accelerate your progress?',
    type: 'multiple',
    options: [
      { value: 'Mentorship', label: 'Mentorship', icon: Heart },
      { value: 'Technical team', label: 'Technical team', icon: Code },
      { value: 'Marketing guidance', label: 'Marketing guidance', icon: TrendingUp },
      { value: 'Funding connections', label: 'Funding connections', icon: DollarSign },
      { value: 'Community feedback', label: 'Community feedback', icon: MessageCircle }
    ]
  },
  {
    id: 'keywordExecution',
    question: 'What does "execution" mean to you in one word?',
    type: 'text',
    placeholder: 'One word that defines execution for you...'
  },
  {
    id: 'superpower',
    question: 'If your startup was a superhero, what would its superpower be?',
    type: 'text',
    placeholder: 'Describe your startup\'s superpower...'
  },
  {
    id: 'confidence',
    question: 'On a scale of 1–10, how confident are you about your idea?',
    type: 'scale',
    min: 1,
    max: 10
  },
  {
    id: 'workStyle',
    question: 'Do you prefer to work solo or build with a team?',
    type: 'single',
    options: [
      { value: 'Solo', label: 'Solo', icon: User },
      { value: 'Team', label: 'Team', icon: Users }
    ]
  },
  {
    id: 'motivation',
    question: 'What inspires you to build — Impact, Innovation, or Income?',
    type: 'single',
    options: [
      { value: 'Impact', label: 'Impact', icon: Heart },
      { value: 'Innovation', label: 'Innovation', icon: Lightbulb },
      { value: 'Income', label: 'Income', icon: DollarSign }
    ]
  },
  {
    id: 'vibeBadge',
    question: 'Which badge best describes your vibe?',
    type: 'single',
    options: [
      { value: 'Visionary', label: 'Visionary', icon: Compass },
      { value: 'Doer', label: 'Doer', icon: Target },
      { value: 'Collaborator', label: 'Collaborator', icon: Users },
      { value: 'Hustler', label: 'Hustler', icon: Flame },
      { value: 'Strategist', label: 'Strategist', icon: Brain }
    ]
  },
  {
    id: 'skills',
    question: 'What are your strongest skills?',
    type: 'multiple',
    options: [
      { value: 'Product/UI-UX', label: 'Product/UI-UX', icon: Palette },
      { value: 'Marketing & Growth', label: 'Marketing & Growth', icon: TrendingUp },
      { value: 'Tech/Development', label: 'Tech/Development', icon: Code },
      { value: 'Operations/Management', label: 'Operations/Management', icon: Settings },
      { value: 'Finance/Fundraising', label: 'Finance/Fundraising', icon: DollarSign }
    ]
  },
  {
    id: 'collaboration',
    question: 'Are you open to mentoring others or collaborating with new founders?',
    type: 'single',
    options: [
      { value: 'Yes', label: 'Yes', icon: CheckCircle },
      { value: 'Maybe later', label: 'Maybe later', icon: Clock },
      { value: 'Not right now', label: 'Not right now', icon: X }
    ]
  },
  {
    id: 'hackathonInterest',
    question: 'Would you like to join upcoming challenges or hackathons by Setu Studios?',
    type: 'single',
    options: [
      { value: 'Yes', label: 'Yes', icon: CheckCircle },
      { value: 'Maybe', label: 'Maybe', icon: Clock },
      { value: 'No', label: 'No', icon: X }
    ]
  }
];

const EnhancedSignupForm: React.FC<{ onComplete: (data: FormData) => void; onClose: () => void }> = ({ onComplete, onClose }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    role: '',
    stage: '',
    industry: '',
    incubation: '',
    ideaPitch: '',
    roadblock: '',
    timeline: '',
    needs: [],
    keywordExecution: '',
    superpower: '',
    confidence: 5,
    workStyle: '',
    motivation: '',
    vibeBadge: '',
    skills: [],
    collaboration: '',
    hackathonInterest: '',
    badges: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateBadges = (data: FormData): string[] => {
    return badgeConfigs
      .filter(config => config.conditions(data))
      .map(config => config.id);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
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
    const badges = generateBadges(formData);
    const completeData = { ...formData, badges };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(completeData);
    setIsSubmitting(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = currentQuestion.type === 'text' 
    ? formData[currentQuestion.id as keyof FormData] !== ''
    : currentQuestion.type === 'multiple'
    ? (formData[currentQuestion.id as keyof FormData] as string[]).length > 0
    : formData[currentQuestion.id as keyof FormData] !== '';

  const shouldShowQuestion = !currentQuestion.conditional || currentQuestion.conditional(formData);

  if (!shouldShowQuestion) {
    handleNext();
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-2xl mx-4 rounded-3xl shadow-2xl ${
          isDark ? 'bg-slate-900' : 'bg-white'
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold gradient-text">Complete Your Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                {currentQuestion.question}
              </h3>

              {currentQuestion.type === 'text' && (
                <textarea
                  value={formData[currentQuestion.id as keyof FormData] as string}
                  onChange={(e) => updateFormData(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-24"
                />
              )}

              {currentQuestion.type === 'scale' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Not confident</span>
                    <span>Very confident</span>
                  </div>
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    value={formData[currentQuestion.id as keyof FormData] as number}
                    onChange={(e) => updateFormData(currentQuestion.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold gradient-text">
                      {formData[currentQuestion.id as keyof FormData] as number}
                    </span>
                  </div>
                </div>
              )}

              {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => {
                    const Icon = option.icon;
                    const isSelected = currentQuestion.type === 'multiple'
                      ? (formData[currentQuestion.id as keyof FormData] as string[]).includes(option.value)
                      : formData[currentQuestion.id as keyof FormData] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (currentQuestion.type === 'multiple') {
                            const currentValues = formData[currentQuestion.id as keyof FormData] as string[];
                            const newValues = isSelected
                              ? currentValues.filter(v => v !== option.value)
                              : [...currentValues, option.value];
                            updateFormData(currentQuestion.id, newValues);
                          } else {
                            updateFormData(currentQuestion.id, option.value);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} className={isSelected ? 'text-orange-500' : 'text-gray-400'} />
                          <span className={`font-medium ${isSelected ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            {option.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="inline mr-2" />
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Profile...</span>
                </div>
              ) : (
                <>
                  Complete Profile
                  <ChevronRight size={20} className="inline ml-2" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} className="inline ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedSignupForm;
