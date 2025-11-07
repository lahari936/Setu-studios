import React from 'react';
import { motion } from 'framer-motion';
import { 
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
  Clock,
  X,
  User
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import BadgeDisplay from './BadgeDisplay';

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

interface ProfileSummaryProps {
  profileData: FormData;
  onEdit: () => void;
  onComplete: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profileData, onEdit, onComplete }) => {
  const { isDark } = useTheme();

  const getMotivationIcon = (motivation: string) => {
    switch (motivation) {
      case 'Impact': return Heart;
      case 'Innovation': return Lightbulb;
      case 'Income': return DollarSign;
      default: return Star;
    }
  };

  const getWorkStyleIcon = (workStyle: string) => {
    switch (workStyle) {
      case 'Solo': return User;
      case 'Team': return Users;
      default: return Users;
    }
  };

  const getCollaborationIcon = (collaboration: string) => {
    switch (collaboration) {
      case 'Yes': return CheckCircle;
      case 'Maybe later': return Clock;
      case 'Not right now': return X;
      default: return MessageCircle;
    }
  };

  const getHackathonIcon = (interest: string) => {
    switch (interest) {
      case 'Yes': return CheckCircle;
      case 'Maybe': return Clock;
      case 'No': return X;
      default: return Calendar;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-4xl mx-4 rounded-3xl shadow-2xl ${
          isDark ? 'bg-slate-900' : 'bg-white'
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Profile Complete! 🎉</h2>
              <p className="text-gray-600 dark:text-gray-400">Here's your personalized startup profile</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">{profileData.role}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{profileData.industry}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Badges</h3>
                <BadgeDisplay badges={profileData.badges} size="lg" showDescription={true} />
              </div>

              {/* Idea Pitch */}
              {profileData.ideaPitch && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Your Idea</h3>
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300 italic">"{profileData.ideaPitch}"</p>
                  </div>
                </div>
              )}

              {/* Superpower */}
              {profileData.superpower && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Your Superpower</h3>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">"{profileData.superpower}"</p>
                  </div>
                </div>
              )}

              {/* Execution Keyword */}
              {profileData.keywordExecution && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Your Execution Word</h3>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg">
                    {profileData.keywordExecution}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Stage & Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Rocket size={20} className="text-blue-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.stage || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={20} className="text-green-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Timeline</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.timeline || 'Not specified'}</p>
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Confidence Level</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(profileData.confidence / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold gradient-text">{profileData.confidence}/10</span>
                </div>
              </div>

              {/* Skills */}
              {profileData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Needs */}
              {profileData.needs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">What You Need</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.needs.map((need, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Style & Motivation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getWorkStyleIcon(profileData.workStyle), { size: 20, className: "text-purple-500" })}
                    <h4 className="font-semibold text-gray-900 dark:text-white">Work Style</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.workStyle || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getMotivationIcon(profileData.motivation), { size: 20, className: "text-pink-500" })}
                    <h4 className="font-semibold text-gray-900 dark:text-white">Motivation</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.motivation || 'Not specified'}</p>
                </div>
              </div>

              {/* Collaboration & Hackathon Interest */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getCollaborationIcon(profileData.collaboration), { size: 20, className: "text-teal-500" })}
                    <h4 className="font-semibold text-gray-900 dark:text-white">Collaboration</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.collaboration || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getHackathonIcon(profileData.hackathonInterest), { size: 20, className: "text-indigo-500" })}
                    <h4 className="font-semibold text-gray-900 dark:text-white">Hackathons</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.hackathonInterest || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <button
              onClick={onEdit}
              className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={onComplete}
              className="btn-primary px-8 py-2"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSummary;
