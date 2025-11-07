import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  Linkedin, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star, 
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { LinkedInProfile } from '../services/linkedinService';

interface MentorProfileCardProps {
  mentor: {
    id: number;
    name: string;
    domain: string;
    expertise: string;
    photo: string;
    experience: string;
    company: string;
    verified?: boolean;
    bio?: string;
    linkedin?: string;
    email?: string;
    calendlyUrl?: string;
    location?: string;
    rating?: number;
    sessionsCompleted?: number;
    specialties?: string[];
  };
  linkedinProfile?: LinkedInProfile;
  userType?: 'founder' | 'mentor' | 'early-stage';
  onConnect: (mentor: MentorProfileCardProps['mentor']) => void;
  onScheduleMeeting: (mentor: MentorProfileCardProps['mentor']) => void;
}

const MentorProfileCard: React.FC<MentorProfileCardProps> = ({
  mentor,
  linkedinProfile,
  userType,
  onConnect,
  onScheduleMeeting
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getUserTypeBadge = () => {
    if (!userType) return null;
    
    const badges = {
      founder: { text: 'Founder', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      mentor: { text: 'Mentor', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'early-stage': { text: 'Early Stage', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
    };
    
    const badge = badges[userType];
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl transition-all duration-300"
      whileHover={{ y: -4 }}
      layout
    >
      <div className={`rounded-2xl border-2 transition-all duration-300 ${
        isDark 
          ? 'bg-slate-800 border-slate-700 hover:border-orange-500/50' 
          : 'bg-white border-gray-200 hover:border-orange-300'
      } hover:shadow-xl hover:shadow-orange-500/10`}>
        
        {/* Profile Header */}
        <div className="p-6 text-center">
          {/* Profile Image */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
              <img 
                src={mentor.photo} 
                alt={mentor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${mentor.name}&size=128&background=f97316&color=fff`;
                }}
              />
            </div>
            {mentor.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Award size={16} className="text-white" />
              </div>
            )}
          </div>

          {/* Name and Role */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {mentor.name}
          </h3>
          <p className="text-orange-500 font-semibold mb-2">
            {mentor.domain}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
            {mentor.company}
          </p>

          {/* User Type Badge */}
          {getUserTypeBadge()}

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-4 text-sm mt-4">
            {mentor.rating && (
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {mentor.rating}
                </span>
              </div>
            )}
            {mentor.sessionsCompleted && (
              <div className="flex items-center gap-1">
                <Briefcase size={16} className="text-orange-500" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {mentor.sessionsCompleted} sessions
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-orange-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {mentor.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="px-6 pb-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                View Full Profile
              </>
            )}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`px-6 pb-6 space-y-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                {/* Bio */}
                {(mentor.bio || linkedinProfile?.summary) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {mentor.bio || linkedinProfile?.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {mentor.experience && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Experience</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {mentor.experience}
                    </p>
                  </div>
                )}

                {/* LinkedIn Experience */}
                {linkedinProfile?.experience && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Professional Experience</h3>
                    <div className="space-y-3">
                      {linkedinProfile.experience.slice(0, 3).map((exp, index) => (
                        <div key={index} className="border-l-4 border-orange-500 pl-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                          <p className="text-orange-500 font-medium text-sm">{exp.company}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {exp.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {(mentor.specialties || linkedinProfile?.skills) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {(mentor.specialties || linkedinProfile?.skills?.slice(0, 6) || []).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-orange-300/20 to-orange-400/20 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 text-xs rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex items-center gap-4 flex-wrap">
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin size={16} />
                      LinkedIn
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {mentor.email && (
                    <a
                      href={`mailto:${mentor.email}`}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleMeeting(mentor);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-400 hover:via-orange-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <Calendar size={16} />
                    Schedule Meeting
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnect(mentor);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-500/20 to-gray-600/20 dark:from-gray-600/30 dark:to-gray-700/30 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:from-gray-500/30 hover:to-gray-600/30 dark:hover:from-gray-600/40 dark:hover:to-gray-700/40 transition-all duration-300 hover:scale-105 text-sm border border-gray-300 dark:border-gray-600"
                  >
                    <MessageCircle size={16} />
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MentorProfileCard;
