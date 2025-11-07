import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  User, Edit3, MapPin, Briefcase, GraduationCap, Calendar, 
  MessageCircle, Share2, MoreHorizontal, Plus, BookOpen, 
  Award, Users, TrendingUp, Eye, Heart, MessageSquare,
  Rocket, Lightbulb, Target, Zap, Crown, Flame, Brain, Compass,
  BarChart3, Clock, Star, Download, ExternalLink
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import BadgeDisplay from '../components/BadgeDisplay';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

interface UserBlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published';
  likes: number;
  views: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  position?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    duration: string;
  }>;
  connections?: number;
  followers?: number;
  following?: number;
  posts?: number;
  // Enhanced profile data
  role?: string;
  stage?: string;
  industry?: string;
  ideaPitch?: string;
  superpower?: string;
  keywordExecution?: string;
  confidence?: number;
  workStyle?: string;
  motivation?: string;
  vibeBadge?: string;
  needs?: string[];
  roadblock?: string;
  timeline?: string;
  collaboration?: string;
  hackathonInterest?: string;
  badges?: string[];
}

const Profile: React.FC = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBlogs, setUserBlogs] = useState<UserBlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'experience' | 'analysis'>('posts');
  const [ideaAnalyses, setIdeaAnalyses] = useState<any[]>([]);
  const [analysisStats, setAnalysisStats] = useState<any>(null);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);

  const loadIdeaAnalyses = async () => {
    if (!user) return;
    
    setLoadingAnalyses(true);
    try {
      const response = await apiService.getUserIdeaAnalyses(user.uid, user.email || '');
      if (response.success && response.data) {
        setIdeaAnalyses(response.data.analyses);
      }
      
      const statsResponse = await apiService.getAnalysisStats(user.uid, user.email || '');
      if (statsResponse.success && statsResponse.data) {
        setAnalysisStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load idea analyses:', error);
      showNotification('Failed to load idea analyses', 'error');
    } finally {
      setLoadingAnalyses(false);
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      // Load enhanced profile data from localStorage
      const enhancedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      
      // Load user profile data
      const profileData: UserProfile = {
        id: user.uid,
        name: userProfile.name,
        email: user.email || '',
        company: userProfile.company || '',
        position: enhancedProfile.role || 'Startup Founder',
        location: 'Remote',
        bio: enhancedProfile.ideaPitch || 'Passionate entrepreneur building the next big thing. Always learning, always growing.',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=f97316&color=fff`,
        coverImage: `https://picsum.photos/1200/300?random=${user.uid.length}`,
        skills: enhancedProfile.skills || ['Entrepreneurship', 'Product Development', 'Strategy', 'Leadership'],
        experience: [
          {
            title: enhancedProfile.role || 'Founder & CEO',
            company: userProfile.company || 'My Startup',
            duration: '2024 - Present',
            description: 'Leading the vision and strategy for our innovative startup.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Technology',
            institution: 'University Name',
            duration: '2020 - 2024'
          }
        ],
        connections: 150,
        followers: 89,
        following: 234,
        posts: 0,
        // Enhanced profile data
        role: enhancedProfile.role,
        stage: enhancedProfile.stage,
        industry: enhancedProfile.industry,
        ideaPitch: enhancedProfile.ideaPitch,
        superpower: enhancedProfile.superpower,
        keywordExecution: enhancedProfile.keywordExecution,
        confidence: enhancedProfile.confidence,
        workStyle: enhancedProfile.workStyle,
        motivation: enhancedProfile.motivation,
        vibeBadge: enhancedProfile.vibeBadge,
        needs: enhancedProfile.needs,
        roadblock: enhancedProfile.roadblock,
        timeline: enhancedProfile.timeline,
        collaboration: enhancedProfile.collaboration,
        hackathonInterest: enhancedProfile.hackathonInterest,
        badges: enhancedProfile.badges || []
      };
      setProfile(profileData);

      // Load user's blog posts
      const userPosts = JSON.parse(localStorage.getItem('user_blog_posts') || '[]');
      const userSpecificPosts = userPosts.filter((post: UserBlogPost) => post.author.id === user.uid);
      setUserBlogs(userSpecificPosts);
    }
  }, [user, userProfile]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      await updateProfile({
        name: profile.name,
        company: profile.company,
        phone: profile.location
      });
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleConnect = () => {
    showNotification('Connection request sent!', 'success');
  };

  if (!user || !userProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="container mx-auto max-w-4xl">
        {/* Cover Photo */}
        <AnimatedCard className="relative h-64 md:h-80 overflow-hidden rounded-t-xl">
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Edit Cover Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
            <Edit3 className="w-5 h-5 text-white" />
          </button>
        </AnimatedCard>

        {/* Profile Info */}
        <AnimatedCard className="relative -mt-16 mb-6 rounded-xl">
          <div className="p-6 pt-20">
            {/* Profile Picture */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                  />
                  <button className="absolute -bottom-2 -right-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{profile.position}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profile.company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Connect
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button className="p-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profile.connections}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profile.followers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profile.following}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{userBlogs.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
              </div>
            </div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Badges</h3>
                <BadgeDisplay badges={profile.badges} size="lg" showDescription={true} />
              </div>
            )}

            {/* Bio */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Enhanced Profile Info */}
            {profile.superpower && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Superpower</h4>
                <p className="text-gray-700 dark:text-gray-300 italic">"{profile.superpower}"</p>
              </div>
            )}

            {profile.keywordExecution && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Execution Word</h4>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg">
                  {profile.keywordExecution}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {profile.stage && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Rocket size={20} className="text-blue-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.stage}</p>
                </div>
              )}
              
              {profile.industry && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase size={20} className="text-green-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Industry</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.industry}</p>
                </div>
              )}

              {profile.confidence && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target size={20} className="text-purple-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Confidence</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(profile.confidence / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{profile.confidence}/10</span>
                  </div>
                </div>
              )}

              {profile.workStyle && (
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users size={20} className="text-pink-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Work Style</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.workStyle}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Posts ({userBlogs.length})
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'about'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'experience'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Experience
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analysis');
                    loadIdeaAnalyses();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analysis'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Idea Analysis
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Share your startup journey and insights with the community
                    </p>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Write Your First Post
                    </button>
                  </div>
                ) : (
                  userBlogs.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Education</h3>
                  {profile.education?.map((edu, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{edu.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                {profile.experience?.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.duration}</p>
                    <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {/* Analysis Stats */}
                {analysisStats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="modern-card p-4 text-center">
                      <BarChart3 size={24} className="text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-500">{analysisStats.totalAnalyses || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Analyses</div>
                    </div>
                    <div className="modern-card p-4 text-center">
                      <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-500">{analysisStats.completedAnalyses || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="modern-card p-4 text-center">
                      <Eye size={24} className="text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-500">{analysisStats.totalViews || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                    </div>
                    <div className="modern-card p-4 text-center">
                      <Star size={24} className="text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-500">{analysisStats.bookmarkedAnalyses || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bookmarked</div>
                    </div>
                  </div>
                )}

                {/* Analysis List */}
                {loadingAnalyses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your idea analyses...</p>
                  </div>
                ) : ideaAnalyses.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Idea Analyses Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start analyzing your startup ideas to see them here
                    </p>
                    <button
                      onClick={() => window.location.href = '/idea-analyzer'}
                      className="btn-primary"
                    >
                      <Brain size={20} className="mr-2" />
                      Analyze Your First Idea
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Idea Analysis History
                    </h3>
                    {ideaAnalyses.map((analysis) => (
                      <div key={analysis._id} className="modern-card p-6 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {analysis.ideaName}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                              {analysis.ideaDescription}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {new Date(analysis.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Eye size={14} className="mr-1" />
                                {analysis.userInteraction?.viewCount || 0} views
                              </span>
                              {analysis.userInteraction?.rating && (
                                <span className="flex items-center">
                                  <Star size={14} className="mr-1 text-yellow-500" />
                                  {analysis.userInteraction.rating}/5
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {analysis.userInteraction?.isBookmarked && (
                              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Star size={16} className="text-yellow-500" />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                // Navigate to analysis view
                                window.location.href = `/idea-analyzer?analysis=${analysis._id}`;
                              }}
                              className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                            >
                              <ExternalLink size={16} className="text-orange-500" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Analysis Preview */}
                        {analysis.analysis?.executive_summary && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Executive Summary</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {analysis.analysis.executive_summary.overview}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Profile;
