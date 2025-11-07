import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Target, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Clock,
  Star,
  Zap,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Eye,
  ThumbsUp,
  BookOpen,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from './AnimatedCard';

interface Streak {
  current: number;
  longest: number;
  lastActivity: string;
  milestones: StreakMilestone[];
}

interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  achieved: boolean;
  reward: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  participants: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  progress: number;
  requirements: string[];
}

interface LiveFeedPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    badge: string;
  };
  content: string;
  type: 'milestone' | 'achievement' | 'question' | 'update';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badge: string;
  streak: number;
  achievements: number;
}

const EngagementFeatures: React.FC = () => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'streaks' | 'challenges' | 'feed' | 'leaderboard'>('streaks');
  const [streak, setStreak] = useState<Streak>({
    current: 7,
    longest: 15,
    lastActivity: new Date().toISOString(),
    milestones: [
      { days: 3, title: 'Getting Started', description: '3-day streak', achieved: true, reward: '10 points' },
      { days: 7, title: 'Week Warrior', description: '7-day streak', achieved: true, reward: '25 points' },
      { days: 14, title: 'Consistency Champion', description: '14-day streak', achieved: false, reward: '50 points' },
      { days: 30, title: 'Monthly Master', description: '30-day streak', achieved: false, reward: '100 points' }
    ]
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Pitch Your Idea in 30 Words',
      description: 'Create a compelling elevator pitch for your startup idea in exactly 30 words.',
      type: 'weekly',
      difficulty: 'medium',
      points: 50,
      participants: 127,
      deadline: '2024-01-15',
      status: 'active',
      progress: 0,
      requirements: ['Submit 30-word pitch', 'Get 5 community votes', 'Share on social media']
    },
    {
      id: '2',
      title: 'MVP in 7 Days',
      description: 'Build a minimum viable product prototype in one week.',
      type: 'weekly',
      difficulty: 'hard',
      points: 100,
      participants: 89,
      deadline: '2024-01-20',
      status: 'active',
      progress: 0,
      requirements: ['Create wireframes', 'Build prototype', 'Test with 5 users', 'Document learnings']
    },
    {
      id: '3',
      title: 'Daily Learning',
      description: 'Complete one startup-related learning activity each day.',
      type: 'daily',
      difficulty: 'easy',
      points: 10,
      participants: 234,
      deadline: '2024-01-12',
      status: 'active',
      progress: 0,
      requirements: ['Read article', 'Watch video', 'Take course', 'Listen to podcast']
    }
  ]);

  const [liveFeed, setLiveFeed] = useState<LiveFeedPost[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        role: 'SaaS Founder',
        avatar: '👩‍💼',
        badge: '🚀 Founder'
      },
      content: 'Just launched our beta version! 🎉 500+ users signed up in the first week. The feedback has been incredible. Next step: Series A funding round.',
      type: 'milestone',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      tags: ['launch', 'beta', 'funding']
    },
    {
      id: '2',
      author: {
        name: 'Mike Rodriguez',
        role: 'Tech Mentor',
        avatar: '👨‍💻',
        badge: '🧠 Mentor'
      },
      content: 'Looking for a co-founder with strong technical background for my fintech startup. We have MVP ready and initial funding secured. DM me if interested!',
      type: 'question',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 15,
      shares: 2,
      isLiked: true,
      tags: ['cofounder', 'fintech', 'technical']
    },
    {
      id: '3',
      author: {
        name: 'Alex Johnson',
        role: 'Early Stage Founder',
        avatar: '👨‍🚀',
        badge: '🌱 Early Stage'
      },
      content: 'Completed the "MVP in 7 Days" challenge! Built a working prototype of our AI-powered productivity tool. The community feedback was amazing!',
      type: 'achievement',
      timestamp: '6 hours ago',
      likes: 18,
      comments: 5,
      shares: 1,
      isLiked: false,
      tags: ['challenge', 'mvp', 'ai']
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah Chen', points: 1250, badge: '🚀 Founder', streak: 12, achievements: 8 },
    { rank: 2, name: 'Mike Rodriguez', points: 1180, badge: '🧠 Mentor', streak: 8, achievements: 6 },
    { rank: 3, name: 'Alex Johnson', points: 950, badge: '🌱 Early Stage', streak: 15, achievements: 5 },
    { rank: 4, name: 'Emma Wilson', points: 890, badge: '🚀 Founder', streak: 6, achievements: 4 },
    { rank: 5, name: 'David Kim', points: 750, badge: '🤝 Co-founder', streak: 10, achievements: 3 }
  ]);

  const handleLike = (postId: string) => {
    setLiveFeed(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: challenge.participants + 1, status: 'active' as const }
        : challenge
    ));
    showNotification('Successfully joined the challenge!', 'success');
  };

  const getStreakColor = (days: number): string => {
    if (days >= 30) return 'text-purple-500';
    if (days >= 14) return 'text-orange-500';
    if (days >= 7) return 'text-green-500';
    return 'text-orange-500';
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const renderStreaks = () => (
    <div className="space-y-6">
      {/* Current Streak */}
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold flex items-center">
            <Flame size={28} className="mr-3 text-orange-500" />
            Current Streak
          </h3>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getStreakColor(streak.current)}`}>
              {streak.current}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">days</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((streak.current / 30) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Longest streak: {streak.longest} days • Last activity: {new Date(streak.lastActivity).toLocaleDateString()}
        </p>
      </AnimatedCard>

      {/* Streak Milestones */}
      <AnimatedCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Trophy size={24} className="mr-2 text-yellow-500" />
          Streak Milestones
        </h3>
        <div className="space-y-3">
          {streak.milestones.map((milestone, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              milestone.achieved 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{milestone.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</div>
                </div>
                <div className="text-right">
                  {milestone.achieved ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <div className="text-sm text-gray-500">{milestone.days} days</div>
                  )}
                </div>
              </div>
              {milestone.achieved && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Reward: {milestone.reward}
                </div>
              )}
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <Target size={28} className="mr-3 text-sarbuzz-primary" />
          Weekly Challenges
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {challenges.filter(c => c.status === 'active').length} active challenges
        </div>
      </div>

      {challenges.map((challenge) => (
        <AnimatedCard key={challenge.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold">{challenge.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  {challenge.points} pts
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {challenge.participants} participants
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  Due {new Date(challenge.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium mb-2">Requirements:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {challenge.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => handleJoinChallenge(challenge.id)}
              className="px-6 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300"
            >
              Join Challenge
            </button>
            <div className="text-sm text-gray-500">
              {challenge.type} • {challenge.difficulty}
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );

  const renderLiveFeed = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <MessageSquare size={28} className="mr-3 text-sarbuzz-primary" />
          Live Community Feed
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
        </div>
      </div>

      {liveFeed.map((post) => (
        <AnimatedCard key={post.id} className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center text-2xl">
              {post.author.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold">{post.author.name}</h4>
                <span className="text-sm text-gray-500">{post.author.badge}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.author.role}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.timestamp}</span>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-sarbuzz-primary/10 text-sarbuzz-primary rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  } transition-colors duration-300`}
                >
                  <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-orange-500 transition-colors duration-300">
                  <MessageSquare size={20} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-300">
                  <Share2 size={20} />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center">
        <Trophy size={28} className="mr-3 text-yellow-500" />
        Community Leaderboard
      </h3>

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <AnimatedCard key={entry.rank} className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                entry.rank === 1 ? 'bg-yellow-500 text-white' :
                entry.rank === 2 ? 'bg-gray-400 text-white' :
                entry.rank === 3 ? 'bg-orange-500 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {entry.rank}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold">{entry.name}</h4>
                  <span className="text-sm">{entry.badge}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star size={16} className="mr-1" />
                    {entry.points} points
                  </div>
                  <div className="flex items-center">
                    <Flame size={16} className="mr-1" />
                    {entry.streak} day streak
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-1" />
                    {entry.achievements} achievements
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">Community Engagement</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect, compete, and grow with fellow entrepreneurs
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'streaks', label: 'Streaks', icon: Flame },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'feed', label: 'Live Feed', icon: MessageSquare },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-sarbuzz-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'streaks' && renderStreaks()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'feed' && renderLiveFeed()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  );
};

export default EngagementFeatures;
