import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Heart, MessageCircle, Share2, BookOpen, 
  Users, TrendingUp, Eye, MoreHorizontal, User, Calendar, Tag
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from '../components/AnimatedCard';
import BlogPostEditor from '../components/BlogPostEditor';
import { motion } from 'framer-motion';

interface BlogPost {
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
  comments: number;
}

interface Activity {
  id: string;
  type: 'blog_post' | 'connection' | 'mentor_application' | 'meeting_scheduled';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  metadata?: any;
}

const Feed: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showBlogEditor, setShowBlogEditor] = useState(false);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = () => {
    try {
      // Load blog posts from localStorage
      const globalPosts = JSON.parse(localStorage.getItem('global_blog_feed') || '[]');
      const samplePosts = JSON.parse(localStorage.getItem('user_blog_posts') || '[]');
      
      // Combine and sort by date
      const allPosts = [...globalPosts, ...samplePosts]
        .sort((a: BlogPost, b: BlogPost) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      setPosts(allPosts);

      // Generate sample activities
      const sampleActivities: Activity[] = [
        {
          id: '1',
          type: 'blog_post',
          user: {
            id: 'user1',
            name: 'Sarah Chen',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=f97316&color=fff'
          },
          content: 'published a new blog post',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { postTitle: 'From Idea to IPO: A Founder\'s Journey' }
        },
        {
          id: '2',
          type: 'connection',
          user: {
            id: 'user2',
            name: 'Michael Rodriguez',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Rodriguez&background=f97316&color=fff'
          },
          content: 'connected with a new mentor',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'mentor_application',
          user: {
            id: 'user3',
            name: 'Emily Watson',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Watson&background=f97316&color=fff'
          },
          content: 'applied to become a mentor',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];

      setActivities(sampleActivities);
    } catch (error) {
      console.error('Error loading feed data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
    showNotification('Post liked!', 'success');
  };

  const handleSharePost = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Post link copied to clipboard!', 'success');
    }
  };

  const getUniqueTags = () => {
    const allTags = posts.flatMap(post => post.tags);
    return Array.from(new Set(allTags));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4 loading-innovation"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white gradient-text-entrepreneur animate-startup-rise">Startup Feed</h1>
              <p className="text-gray-600 dark:text-gray-400 animate-business-growth">Stay updated with the latest insights and activities</p>
            </div>
            <button
              onClick={() => setShowBlogEditor(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Write Post
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Topics</option>
                {getUniqueTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap gap-2">
            {getUniqueTags().slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {filteredPosts.length === 0 ? (
              <AnimatedCard className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || selectedTag ? 'Try adjusting your search criteria' : 'Be the first to share your startup story!'}
                </p>
                <button
                  onClick={() => setShowBlogEditor(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Write First Post
                </button>
              </AnimatedCard>
            ) : (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(post.publishedAt)}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                      )}
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                          <Eye className="w-5 h-5" />
                          <span>{post.views}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleSharePost(post)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{activity.user.name}</span> {activity.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>

            {/* Trending Topics */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {getUniqueTags().slice(0, 5).map((tag, index) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">#{tag}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{index + 1}</span>
                  </div>
                ))}
              </div>
            </AnimatedCard>

            {/* Quick Stats */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Posts</span>
                  <span className="text-sm font-semibold text-orange-500">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active Authors</span>
                  <span className="text-sm font-semibold text-orange-500">
                    {new Set(posts.map(post => post.author.id)).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Likes</span>
                  <span className="text-sm font-semibold text-orange-500">
                    {posts.reduce((sum, post) => sum + post.likes, 0)}
                  </span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Blog Post Editor */}
      <BlogPostEditor
        isOpen={showBlogEditor}
        onClose={() => setShowBlogEditor(false)}
        onPostCreated={() => {
          loadFeedData();
          setShowBlogEditor(false);
        }}
      />
    </div>
  );
};

export default Feed;
