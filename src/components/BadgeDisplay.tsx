import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Users, 
  Heart, 
  DollarSign, 
  Lightbulb, 
  Rocket, 
  TrendingUp, 
  Zap, 
  Compass, 
  Target, 
  Flame, 
  Brain,
  Award,
  Star
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface BadgeDisplayProps {
  badges: string[];
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

const badgeMap: Record<string, Badge> = {
  'founder': {
    id: 'founder',
    name: 'Founder',
    icon: Crown,
    color: 'from-yellow-400 to-orange-500',
    description: 'Leading the vision and execution'
  },
  'co-founder': {
    id: 'co-founder',
    name: 'Co-Founder',
    icon: Users,
    color: 'from-blue-400 to-purple-500',
    description: 'Building together, stronger together'
  },
  'mentor': {
    id: 'mentor',
    name: 'Mentor',
    icon: Heart,
    color: 'from-green-400 to-teal-500',
    description: 'Guiding the next generation'
  },
  'investor': {
    id: 'investor',
    name: 'Investor',
    icon: DollarSign,
    color: 'from-emerald-400 to-green-500',
    description: 'Fueling innovation with capital'
  },
  'early-innovator': {
    id: 'early-innovator',
    name: 'Early Innovator',
    icon: Lightbulb,
    color: 'from-pink-400 to-rose-500',
    description: 'Pioneering the future'
  },
  'team-member': {
    id: 'team-member',
    name: 'Team Player',
    icon: Users,
    color: 'from-indigo-400 to-blue-500',
    description: 'Collaborative builder'
  },
  'idea-stage': {
    id: 'idea-stage',
    name: 'Idea Stage',
    icon: Lightbulb,
    color: 'from-yellow-300 to-orange-400',
    description: 'Conceptualizing the future'
  },
  'mvp-ready': {
    id: 'mvp-ready',
    name: 'MVP Ready',
    icon: Rocket,
    color: 'from-blue-400 to-cyan-500',
    description: 'Ready to launch'
  },
  'early-traction': {
    id: 'early-traction',
    name: 'Early Traction',
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500',
    description: 'Gaining momentum'
  },
  'scaling': {
    id: 'scaling',
    name: 'Scaling',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
    description: 'Growing fast'
  },
  'visionary': {
    id: 'visionary',
    name: 'Visionary',
    icon: Compass,
    color: 'from-indigo-400 to-purple-500',
    description: 'Seeing the big picture'
  },
  'doer': {
    id: 'doer',
    name: 'Doer',
    icon: Target,
    color: 'from-red-400 to-orange-500',
    description: 'Getting things done'
  },
  'collaborator': {
    id: 'collaborator',
    name: 'Collaborator',
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
    description: 'Building together'
  },
  'hustler': {
    id: 'hustler',
    name: 'Hustler',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    description: 'Relentless execution'
  },
  'strategist': {
    id: 'strategist',
    name: 'Strategist',
    icon: Brain,
    color: 'from-purple-400 to-indigo-500',
    description: 'Strategic thinking'
  }
};

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  size = 'md', 
  showDescription = false, 
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-16 h-16 text-lg';
      default:
        return 'w-12 h-12 text-sm';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badgeId, index) => {
        const badge = badgeMap[badgeId];
        if (!badge) return null;

        const Icon = badge.icon;

        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group ${getSizeClasses()}`}
          >
            <div className={`
              w-full h-full rounded-full bg-gradient-to-r ${badge.color} 
              flex items-center justify-center shadow-lg hover:shadow-xl 
              transition-all duration-300 cursor-pointer hover:scale-110
            `}>
              <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="text-white" />
            </div>

            {/* Tooltip */}
            {showDescription && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <div className="font-semibold">{badge.name}</div>
                <div className="text-gray-300">{badge.description}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;
