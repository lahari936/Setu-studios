import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Users, 
  Target, 
  Bell, 
  BookOpen, 
  Search, 
  Lightbulb,
  Trophy,
  Flame,
  MessageSquare,
  Award,
  Zap,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Rocket,
  TrendingUp,
  Globe,
  Shield,
  Heart
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '../components/AnimatedCard';
import EnhancedSignup from '../components/EnhancedSignup';
import CoFounderX2 from '../components/CoFounderX2';

const EnhancedDemo: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [showCoFounderX, setShowCoFounderX] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'Enhanced Signup Flow',
      description: 'Intelligent multi-step signup with role-based questions and badge system',
      color: 'from-purple-500 to-purple-600',
      demo: () => setShowSignup(true),
      route: '/enhanced-signup'
    },
    {
      icon: Brain,
      title: 'CoFounderX 2.0',
      description: 'Context-aware AI co-founder with advanced capabilities and memory',
      color: 'from-orange-500 to-orange-600',
      demo: () => setShowCoFounderX(true),
      route: '/cofounderx'
    },
    {
      icon: Users,
      title: 'Smart Profile System',
      description: 'Profile completeness tracking with interest tags and recommendations',
      color: 'from-green-500 to-green-600',
      demo: () => navigate('/smart-profile'),
      route: '/smart-profile'
    },
    {
      icon: Trophy,
      title: 'Engagement Features',
      description: 'Startup streaks, weekly challenges, and live community feed',
      color: 'from-orange-500 to-orange-600',
      demo: () => navigate('/engagement'),
      route: '/engagement'
    },
    {
      icon: Bell,
      title: 'Dynamic Notifications',
      description: 'Smart notifications for mentorship, funding, and AI insights',
      color: 'from-red-500 to-red-600',
      demo: () => navigate('/bonus-features'),
      route: '/bonus-features'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Curated startup guides, templates, and AI-generated blueprints',
      color: 'from-orange-500 to-orange-600',
      demo: () => navigate('/bonus-features'),
      route: '/bonus-features'
    },
    {
      icon: Search,
      title: 'Investor Discovery',
      description: 'Find and connect with relevant investors based on your startup',
      color: 'from-pink-500 to-pink-600',
      demo: () => navigate('/bonus-features'),
      route: '/bonus-features'
    },
    {
      icon: Lightbulb,
      title: 'AI Business Blueprints',
      description: 'Automatically generated business models and frameworks',
      color: 'from-yellow-500 to-yellow-600',
      demo: () => navigate('/bonus-features'),
      route: '/bonus-features'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2,500+', icon: Users },
    { label: 'AI Conversations', value: '15,000+', icon: Brain },
    { label: 'Successful Matches', value: '850+', icon: Heart },
    { label: 'Resources Downloaded', value: '5,200+', icon: BookOpen }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'SaaS Founder',
      content: 'CoFounderX 2.0 has been a game-changer for my startup journey. The contextual advice is incredibly relevant and actionable.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Tech Mentor',
      content: 'The enhanced signup process helps me connect with the right founders. The badge system makes it easy to identify potential matches.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Alex Johnson',
      role: 'Early Stage Founder',
      content: 'The engagement features keep me motivated. The weekly challenges are perfect for staying focused on my goals.',
      avatar: '👨‍🚀',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sarbuzz-primary/10 to-sarbuzz-secondary/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Setu Studios</span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">Enhanced</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the future of startup development with AI-powered features, 
              intelligent matching, and community-driven growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSignup(true)}
                className="px-8 py-4 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Sparkles size={24} className="inline mr-2" />
                Try Enhanced Signup
              </button>
              <button
                onClick={() => setShowCoFounderX(true)}
                className="px-8 py-4 border-2 border-sarbuzz-primary text-sarbuzz-primary rounded-xl font-semibold hover:bg-sarbuzz-primary hover:text-white transition-all duration-300"
              >
                <Brain size={24} className="inline mr-2" />
                Chat with CoFounderX 2.0
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <AnimatedCard key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold text-sarbuzz-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Enhanced Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the powerful new capabilities that make Setu Studios the ultimate startup platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={index} className="p-8 hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={feature.demo}
                      className="flex-1 px-4 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      <Play size={16} className="mr-2" />
                      Demo
                    </button>
                    <button
                      onClick={() => navigate(feature.route)}
                      className="px-4 py-2 border-2 border-sarbuzz-primary text-sarbuzz-primary rounded-lg hover:bg-sarbuzz-primary hover:text-white transition-all duration-300"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real feedback from entrepreneurs who've transformed their startups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedCard className="p-12">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Startup Journey?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of entrepreneurs who are already using Setu Studios to build, grow, and scale their startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSignup(true)}
                className="px-8 py-4 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Rocket size={24} className="inline mr-2" />
                Get Started Now
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-4 border-2 border-sarbuzz-primary text-sarbuzz-primary rounded-xl font-semibold hover:bg-sarbuzz-primary hover:text-white transition-all duration-300"
              >
                <Target size={24} className="inline mr-2" />
                Explore Services
              </button>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Enhanced Signup Modal */}
      <EnhancedSignup isOpen={showSignup} onClose={() => setShowSignup(false)} />
      
      {/* CoFounderX 2.0 Modal */}
      <CoFounderX2 />
    </div>
  );
};

export default EnhancedDemo;
