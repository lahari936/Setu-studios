import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  User, Edit3, MapPin, Briefcase, GraduationCap, Calendar, 
  MessageCircle, Share2, MoreHorizontal, Plus, BookOpen, 
  Award, Users, TrendingUp, Eye, Heart, MessageSquare
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import { motion } from 'framer-motion';

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
}

const Profile: React.FC = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBlogs, setUserBlogs] = useState<UserBlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'experience'>('posts');

  useEffect(() => {
    if (user && userProfile) {
      // Load user profile data
      const profileData: UserProfile = {
        id: user.uid,
        name: userProfile.name,
        email: user.email || '',
        company: userProfile.company || '',
        position: 'Startup Founder', // Default position
        location: 'Remote',
        bio: 'Passionate entrepreneur building the next big thing. Always learning, always growing.',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=f97316&color=fff`,
        coverImage: `https://picsum.photos/1200/300?random=${user.uid.length}`,
        skills: ['Entrepreneurship', 'Product Development', 'Strategy', 'Leadership'],
        experience: [
          {
            title: 'Founder & CEO',
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
        posts: 0
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
    <div className="min-h-screen py-20 px-4">
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

            {/* Bio */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

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
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Profile;
