import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  MessageCircle, 
  Linkedin, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star, 
  Award,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { LinkedInProfile } from '../services/linkedinService';

interface MentorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onConnect: (mentor: any) => void;
  onScheduleMeeting: (mentor: any) => void;
}

const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  isOpen,
  onClose,
  mentor,
  linkedinProfile,
  userType,
  onConnect,
  onScheduleMeeting
}) => {
  const { isDark } = useTheme();

  const getUserTypeBadge = () => {
    if (!userType) return null;
    
    const badges = {
      founder: { text: 'Founder', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      mentor: { text: 'Mentor', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'early-stage': { text: 'Early Stage', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
    };
    
    const badge = badges[userType];
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
            isDark ? 'bg-slate-900' : 'bg-white'
          } shadow-2xl`}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
            
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
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

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {mentor.name}
                    </h2>
                    <p className="text-orange-500 font-semibold text-xl mb-1">
                      {mentor.domain}
                    </p>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                      {mentor.company}
                    </p>
                  </div>
                  {getUserTypeBadge()}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm">
                  {mentor.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={20} className="text-yellow-500 fill-current" />
                      <span className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {mentor.rating}
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        ({mentor.sessionsCompleted || 0} sessions)
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin size={20} className="text-orange-500" />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {mentor.location || 'Remote'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={20} className="text-orange-500" />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {mentor.experience} Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Bio */}
            {(mentor.bio || linkedinProfile?.summary) && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {mentor.bio || linkedinProfile?.summary}
                </p>
              </div>
            )}

            {/* LinkedIn Experience */}
            {linkedinProfile?.experience && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Experience</h3>
                <div className="space-y-4">
                  {linkedinProfile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                      <p className="text-orange-500 font-medium">{exp.company}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        {exp.duration}
                      </p>
                      {exp.description && (
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {(mentor.specialties || linkedinProfile?.skills) && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-3">
                  {(mentor.specialties || linkedinProfile?.skills?.slice(0, 8) || []).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Links */}
            <div className="flex items-center gap-6">
              {mentor.linkedin && (
                <a
                  href={mentor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-lg font-medium"
                >
                  <Linkedin size={20} />
                  LinkedIn Profile
                  <ExternalLink size={16} />
                </a>
              )}
              {mentor.email && (
                <a
                  href={`mailto:${mentor.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 text-lg font-medium"
                >
                  <Mail size={20} />
                  Email
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onScheduleMeeting(mentor);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 text-lg"
              >
                <Calendar size={20} />
                Schedule Meeting
              </button>
              <button
                onClick={() => {
                  onConnect(mentor);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 dark:hover:bg-slate-800 transition-all duration-300 text-lg"
              >
                <MessageCircle size={20} />
                Connect
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MentorProfileModal;















