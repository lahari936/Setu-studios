import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Star, 
  Eye, 
  EyeOff,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  FileText,
  Video,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  MessageSquare,
  Send
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from './AnimatedCard';

interface Notification {
  id: string;
  type: 'mentorship' | 'funding' | 'insight' | 'achievement' | 'challenge';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    mentorName?: string;
    fundingAmount?: string;
    challengeTitle?: string;
    achievementTitle?: string;
  };
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'video' | 'article' | 'tool';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  downloads: number;
  isBookmarked: boolean;
  tags: string[];
  author: string;
  fileSize?: string;
  url?: string;
}

interface Investor {
  id: string;
  name: string;
  company: string;
  role: string;
  focus: string[];
  stage: string[];
  location: string;
  bio: string;
  portfolio: string[];
  isVisible: boolean;
  isContacted: boolean;
  lastActive: string;
  contactInfo: {
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences: {
    preferredContact: 'email' | 'linkedin' | 'twitter';
    responseTime: string;
    meetingType: 'virtual' | 'in-person' | 'both';
  };
}

interface BusinessBlueprint {
  id: string;
  title: string;
  description: string;
  category: string;
  framework: 'lean-canvas' | 'business-model-canvas' | 'swot' | 'pitch-deck';
  isGenerated: boolean;
  content: any;
  createdAt: string;
  updatedAt: string;
}

const BonusEnhancements: React.FC = () => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'notifications' | 'resources' | 'investors' | 'blueprints'>('notifications');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'mentorship',
      title: 'New Mentorship Request',
      message: 'Sarah Chen wants to connect for a strategy session about your SaaS startup.',
      timestamp: '2 hours ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/mentorship',
      metadata: { mentorName: 'Sarah Chen' }
    },
    {
      id: '2',
      type: 'funding',
      title: 'Funding Opportunity',
      message: 'Sequoia Capital is looking for early-stage SaaS startups. Your profile matches their criteria.',
      timestamp: '4 hours ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/funding',
      metadata: { fundingAmount: '$500K - $2M' }
    },
    {
      id: '3',
      type: 'insight',
      title: 'AI Insight Available',
      message: 'CoFounderX has analyzed your startup idea and found 3 optimization opportunities.',
      timestamp: '6 hours ago',
      isRead: true,
      priority: 'medium',
      actionUrl: '/ai-insights'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve completed the "MVP in 7 Days" challenge.',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low',
      metadata: { achievementTitle: 'MVP Builder' }
    }
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Pitch Deck Template',
      description: 'Professional 10-slide pitch deck template with investor-focused design.',
      type: 'template',
      category: 'Fundraising',
      difficulty: 'beginner',
      duration: '2 hours',
      rating: 4.8,
      downloads: 1250,
      isBookmarked: true,
      tags: ['pitch', 'fundraising', 'investors'],
      author: 'Setu Studios',
      fileSize: '2.5 MB',
      url: '/templates/pitch-deck.pptx'
    },
    {
      id: '2',
      title: 'Lean Canvas Guide',
      description: 'Step-by-step guide to creating a comprehensive lean canvas for your startup.',
      type: 'guide',
      category: 'Strategy',
      difficulty: 'intermediate',
      duration: '1 hour',
      rating: 4.9,
      downloads: 890,
      isBookmarked: false,
      tags: ['lean-canvas', 'strategy', 'business-model'],
      author: 'Startup Expert',
      url: '/guides/lean-canvas.pdf'
    },
    {
      id: '3',
      title: 'MVP Development Masterclass',
      description: 'Complete video course on building and launching your minimum viable product.',
      type: 'video',
      category: 'Development',
      difficulty: 'advanced',
      duration: '3 hours',
      rating: 4.7,
      downloads: 567,
      isBookmarked: true,
      tags: ['mvp', 'development', 'product'],
      author: 'Tech Mentor',
      url: '/videos/mvp-masterclass.mp4'
    }
  ]);

  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'John Smith',
      company: 'Sequoia Capital',
      role: 'Partner',
      focus: ['SaaS', 'AI', 'FinTech'],
      stage: ['Seed', 'Series A'],
      location: 'San Francisco, CA',
      bio: 'Experienced investor with 15+ years in early-stage SaaS investments.',
      portfolio: ['Stripe', 'Zoom', 'Airbnb'],
      isVisible: true,
      isContacted: false,
      lastActive: '2 hours ago',
      contactInfo: {
        email: 'john@sequoia.com',
        linkedin: 'linkedin.com/in/johnsmith',
        twitter: '@johnsmith'
      },
      preferences: {
        preferredContact: 'email',
        responseTime: '24 hours',
        meetingType: 'both'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Andreessen Horowitz',
      role: 'General Partner',
      focus: ['AI/ML', 'Healthcare', 'Enterprise'],
      stage: ['Series A', 'Series B'],
      location: 'Menlo Park, CA',
      bio: 'Leading investments in AI and healthcare startups.',
      portfolio: ['OpenAI', 'Palantir', 'Stripe'],
      isVisible: true,
      isContacted: true,
      lastActive: '1 day ago',
      contactInfo: {
        linkedin: 'linkedin.com/in/sarahjohnson'
      },
      preferences: {
        preferredContact: 'linkedin',
        responseTime: '48 hours',
        meetingType: 'virtual'
      }
    }
  ]);

  const [blueprints, setBlueprints] = useState<BusinessBlueprint[]>([
    {
      id: '1',
      title: 'AI-Powered SaaS Business Model',
      description: 'Comprehensive business model for AI-powered SaaS startup',
      category: 'SaaS',
      framework: 'business-model-canvas',
      isGenerated: true,
      content: {
        valuePropositions: ['AI-powered automation', 'Real-time insights', 'Scalable solution'],
        customerSegments: ['SMBs', 'Enterprises', 'Startups'],
        revenueStreams: ['Subscription', 'Usage-based', 'Professional services']
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    }
  ]);

  const [isReadyToRaise, setIsReadyToRaise] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    if (notification.actionUrl) {
      showNotification(`Redirecting to ${notification.title}`, 'success');
    }
  };

  const handleResourceBookmark = (resourceId: string) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, isBookmarked: !r.isBookmarked } : r
    ));
  };

  const handleResourceDownload = (resource: Resource) => {
    showNotification(`Downloading ${resource.title}...`, 'success');
    // Simulate download
    setTimeout(() => {
      showNotification(`${resource.title} downloaded successfully!`, 'success');
    }, 2000);
  };

  const handleInvestorContact = (investor: Investor) => {
    setInvestors(prev => prev.map(i => 
      i.id === investor.id ? { ...i, isContacted: true } : i
    ));
    showNotification(`Contact request sent to ${investor.name}`, 'success');
  };

  const toggleInvestorVisibility = () => {
    setIsReadyToRaise(!isReadyToRaise);
    showNotification(
      isReadyToRaise 
        ? 'You\'re now visible to investors' 
        : 'You\'re now private to investors',
      'success'
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mentorship': return Users;
      case 'funding': return DollarSign;
      case 'insight': return Lightbulb;
      case 'achievement': return Award;
      case 'challenge': return Target;
      default: return Bell;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'template': return FileText;
      case 'guide': return BookOpen;
      case 'video': return Video;
      case 'article': return FileText;
      case 'tool': return Zap;
      default: return BookOpen;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <Bell size={28} className="mr-3 text-sarbuzz-primary" />
          Dynamic Notifications
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {notifications.filter(n => !n.isRead).length} unread
          </span>
          <button
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <AnimatedCard 
              key={notification.id} 
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                !notification.isRead ? 'border-l-4 border-sarbuzz-primary bg-sarbuzz-primary/5' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  notification.type === 'mentorship' ? 'bg-orange-100 text-orange-600' :
                  notification.type === 'funding' ? 'bg-green-100 text-green-600' :
                  notification.type === 'insight' ? 'bg-purple-100 text-purple-600' :
                  notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                  {notification.metadata && (
                    <div className="text-sm text-sarbuzz-primary">
                      {notification.metadata.mentorName && `Mentor: ${notification.metadata.mentorName}`}
                      {notification.metadata.fundingAmount && `Amount: ${notification.metadata.fundingAmount}`}
                      {notification.metadata.achievementTitle && `Achievement: ${notification.metadata.achievementTitle}`}
                    </div>
                  )}
                </div>
                {!notification.isRead && (
                  <div className="w-3 h-3 bg-sarbuzz-primary rounded-full"></div>
                )}
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <BookOpen size={28} className="mr-3 text-sarbuzz-primary" />
          Resource Library
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <Filter size={20} className="inline mr-2" />
            Filters
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {showFilters && (
        <AnimatedCard className="p-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Fundraising">Fundraising</option>
              <option value="Strategy">Strategy</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </AnimatedCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = getResourceIcon(resource.type);
          return (
            <AnimatedCard key={resource.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-sarbuzz-primary/10 rounded-lg">
                    <Icon size={24} className="text-sarbuzz-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{resource.author}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleResourceBookmark(resource.id)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    resource.isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                  }`}
                >
                  {resource.isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{resource.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-sarbuzz-primary/10 text-sarbuzz-primary rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-500" />
                    {resource.rating}
                  </div>
                  <div className="flex items-center">
                    <Download size={16} className="mr-1" />
                    {resource.downloads}
                  </div>
                  <div>{resource.duration}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.difficulty}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleResourceDownload(resource)}
                  className="flex-1 px-4 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </button>
                <button className="px-4 py-2 border-2 border-sarbuzz-primary text-sarbuzz-primary rounded-lg hover:bg-sarbuzz-primary hover:text-white transition-all duration-300">
                  <Share2 size={16} />
                </button>
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <Search size={28} className="mr-3 text-sarbuzz-primary" />
          Investor Discovery
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleInvestorVisibility}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              isReadyToRaise 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {isReadyToRaise ? <Eye size={20} className="inline mr-2" /> : <EyeOff size={20} className="inline mr-2" />}
            {isReadyToRaise ? 'Visible to Investors' : 'Private'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {investors.map((investor) => (
          <AnimatedCard key={investor.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {investor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold">{investor.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{investor.role} at {investor.company}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{investor.lastActive}</div>
                <div className="text-xs text-gray-400">{investor.location}</div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{investor.bio}</p>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Focus Areas:</h5>
              <div className="flex flex-wrap gap-2">
                {investor.focus.map((area, index) => (
                  <span key={index} className="px-2 py-1 bg-sarbuzz-primary/10 text-sarbuzz-primary rounded-full text-xs">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Investment Stages:</h5>
              <div className="flex flex-wrap gap-2">
                {investor.stage.map((stage, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {stage}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Notable Portfolio:</h5>
              <div className="flex flex-wrap gap-2">
                {investor.portfolio.slice(0, 3).map((company, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Preferred contact: {investor.preferences.preferredContact} • 
                Response time: {investor.preferences.responseTime}
              </div>
              <button
                onClick={() => handleInvestorContact(investor)}
                disabled={investor.isContacted}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  investor.isContacted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-sarbuzz-primary text-white hover:scale-105'
                }`}
              >
                {investor.isContacted ? 'Contacted' : 'Contact'}
              </button>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderBlueprints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <Lightbulb size={28} className="mr-3 text-sarbuzz-primary" />
          AI-Generated Business Blueprints
        </h3>
        <button className="px-4 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300">
          Generate New Blueprint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blueprints.map((blueprint) => (
          <AnimatedCard key={blueprint.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold">{blueprint.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{blueprint.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{blueprint.category}</div>
                <div className="text-xs text-gray-400">{blueprint.framework}</div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Key Components:</h5>
              <div className="space-y-2">
                {Object.entries(blueprint.content).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <div className="text-gray-600 dark:text-gray-400 ml-2">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Created: {new Date(blueprint.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
                  <Download size={16} />
                </button>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
                  <Share2 size={16} />
                </button>
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
        <h1 className="text-4xl font-bold gradient-text mb-4">Bonus Enhancements</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Advanced features to supercharge your startup journey
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'resources', label: 'Resource Library', icon: BookOpen },
          { id: 'investors', label: 'Investor Discovery', icon: Search },
          { id: 'blueprints', label: 'AI Blueprints', icon: Lightbulb }
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
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'resources' && renderResources()}
        {activeTab === 'investors' && renderInvestors()}
        {activeTab === 'blueprints' && renderBlueprints()}
      </div>
    </div>
  );
};

export default BonusEnhancements;
