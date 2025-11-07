import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb,
  CheckCircle,
  Edit3,
  Star,
  Eye,
  EyeOff,
  Share2,
  Download,
  Bell,
  Settings
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from './AnimatedCard';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  startupStage: string;
  industry: string;
  goal: string;
  experience: string;
  interests: string[];
  badges: Badge[];
  profileCompleteness: number;
  joinedAt: string;
  isVisible: boolean;
  connections: number;
  endorsements: Endorsement[];
  achievements: Achievement[];
  stats: ProfileStats;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  earnedAt: string;
}

interface Endorsement {
  id: string;
  skill: string;
  endorser: string;
  endorserRole: string;
  message: string;
  createdAt: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

interface ProfileStats {
  profileViews: number;
  connections: number;
  endorsements: number;
  achievements: number;
  streak: number;
  level: number;
}

const SmartProfile: React.FC = () => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Load profile from localStorage or create default
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Create default profile
      const defaultProfile: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'founder',
        startupStage: 'mvp',
        industry: 'SaaS',
        goal: 'funding',
        experience: 'intermediate',
        interests: ['AI', 'SaaS', 'Marketing'],
        badges: [
          {
            id: 'founder',
            name: '🚀 Founder',
            icon: 'Rocket',
            color: 'from-orange-500 to-orange-600',
            description: 'Startup founder',
            earnedAt: new Date().toISOString()
          }
        ],
        profileCompleteness: 75,
        joinedAt: new Date().toISOString(),
        isVisible: true,
        connections: 12,
        endorsements: [],
        achievements: [
          {
            id: 'first-login',
            title: 'Welcome Aboard',
            description: 'Completed your first login',
            icon: 'Star',
            earnedAt: new Date().toISOString(),
            points: 10
          }
        ],
        stats: {
          profileViews: 45,
          connections: 12,
          endorsements: 0,
          achievements: 1,
          streak: 3,
          level: 1
        }
      };
      setProfile(defaultProfile);
    }
  }, []);

  const calculateProfileCompleteness = (profile: UserProfile): number => {
    let completeness = 0;
    const fields = [
      'name', 'email', 'role', 'startupStage', 'industry', 
      'goal', 'experience', 'interests'
    ];
    
    fields.forEach(field => {
      if (profile[field as keyof UserProfile] && 
          (Array.isArray(profile[field as keyof UserProfile]) 
            ? (profile[field as keyof UserProfile] as any[]).length > 0
            : profile[field as keyof UserProfile])) {
        completeness += 12.5;
      }
    });
    
    return Math.min(100, completeness);
  };

  const getCompletenessColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCompletenessMessage = (percentage: number): string => {
    if (percentage >= 80) return 'Profile is complete! You\'re visible to investors.';
    if (percentage >= 60) return 'Almost there! Complete a few more fields.';
    return 'Complete your profile to unlock more features.';
  };

  const handleSave = () => {
    if (profile) {
      const updatedProfile = { ...profile, ...editData };
      updatedProfile.profileCompleteness = calculateProfileCompleteness(updatedProfile);
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    }
  };

  const toggleVisibility = () => {
    if (profile) {
      const updatedProfile = { ...profile, isVisible: !profile.isVisible };
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      showNotification(
        updatedProfile.isVisible 
          ? 'Profile is now visible to the community' 
          : 'Profile is now private',
        'success'
      );
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sarbuzz-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Smart Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your professional presence</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300"
          >
            <Edit3 size={20} className="inline mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={toggleVisibility}
            className={`px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 ${
              profile.isVisible 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {profile.isVisible ? <Eye size={20} className="inline mr-2" /> : <EyeOff size={20} className="inline mr-2" />}
            {profile.isVisible ? 'Visible' : 'Private'}
          </button>
        </div>
      </div>

      {/* Profile Completeness */}
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Profile Completeness</h3>
          <span className={`text-2xl font-bold ${getCompletenessColor(profile.profileCompleteness)}`}>
            {profile.profileCompleteness}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <div 
            className="bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${profile.profileCompleteness}%` }}
          ></div>
        </div>
        <p className={`text-sm ${getCompletenessColor(profile.profileCompleteness)}`}>
          {getCompletenessMessage(profile.profileCompleteness)}
        </p>
      </AnimatedCard>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedCard className="p-4 text-center">
          <div className="text-2xl font-bold text-sarbuzz-primary">{profile.stats.profileViews}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
        </AnimatedCard>
        <AnimatedCard className="p-4 text-center">
          <div className="text-2xl font-bold text-sarbuzz-primary">{profile.stats.connections}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Connections</div>
        </AnimatedCard>
        <AnimatedCard className="p-4 text-center">
          <div className="text-2xl font-bold text-sarbuzz-primary">{profile.stats.streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
        </AnimatedCard>
        <AnimatedCard className="p-4 text-center">
          <div className="text-2xl font-bold text-sarbuzz-primary">Level {profile.stats.level}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
        </AnimatedCard>
      </div>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User size={24} className="mr-2 text-sarbuzz-primary" />
              Personal Information
            </h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name || profile.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email || profile.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select
                    value={editData.experience || profile.experience}
                    onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
                  >
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                  <span className="font-medium capitalize">{profile.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                  <span className="font-medium">{new Date(profile.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </AnimatedCard>

          {/* Startup Information */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Rocket size={24} className="mr-2 text-sarbuzz-primary" />
              Startup Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium capitalize">{profile.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                <span className="font-medium capitalize">{profile.startupStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                <span className="font-medium">{profile.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Goal:</span>
                <span className="font-medium capitalize">{profile.goal}</span>
              </div>
            </div>
          </AnimatedCard>

          {/* Interests */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Lightbulb size={24} className="mr-2 text-sarbuzz-primary" />
              Interests & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sarbuzz-primary/10 text-sarbuzz-primary rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Right Column - Badges & Achievements */}
        <div className="space-y-6">
          {/* Badges */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Award size={24} className="mr-2 text-sarbuzz-primary" />
              Badges
            </h3>
            <div className="space-y-3">
              {profile.badges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                  <div>
                    <div className="font-medium">{badge.name.split(' ')[1]}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Achievements */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Star size={24} className="mr-2 text-sarbuzz-primary" />
              Achievements
            </h3>
            <div className="space-y-3">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-sarbuzz-primary rounded-full flex items-center justify-center">
                    <Star size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                    <div className="text-xs text-sarbuzz-primary">+{achievement.points} points</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Recommendations */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users size={24} className="mr-2 text-sarbuzz-primary" />
              You May Want to Connect With
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-sarbuzz-primary/10 to-sarbuzz-secondary/10 rounded-lg">
                <div className="font-medium">Sarah Chen</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">SaaS Founder • AI/ML</div>
                <div className="text-xs text-sarbuzz-primary">Similar interests: AI, SaaS</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-sarbuzz-primary/10 to-sarbuzz-secondary/10 rounded-lg">
                <div className="font-medium">Mike Rodriguez</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tech Mentor • 10+ years</div>
                <div className="text-xs text-sarbuzz-primary">Can help with: Development, Strategy</div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default SmartProfile;
