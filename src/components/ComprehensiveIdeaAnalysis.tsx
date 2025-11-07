import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Calendar,
  Download,
  Share2,
  Bookmark,
  Star,
  Eye,
  Clock,
  Zap,
  Shield,
  Globe,
  Building2,
  Rocket
} from 'lucide-react';
import { analyzeStartupIdea, StartupAnalysis } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ComprehensiveIdeaAnalysisProps {
  ideaName: string;
  ideaDescription: string;
  onAnalysisComplete?: (analysis: StartupAnalysis) => void;
  onSaveAnalysis?: (analysis: StartupAnalysis) => void;
}

const ComprehensiveIdeaAnalysis: React.FC<ComprehensiveIdeaAnalysisProps> = ({
  ideaName,
  ideaDescription,
  onAnalysisComplete,
  onSaveAnalysis
}) => {
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  
  const { user } = useAuth();
  const { isDark } = useTheme();

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'problem', label: 'Problem & Solution', icon: Target },
    { id: 'market', label: 'Market Analysis', icon: Globe },
    { id: 'business', label: 'Business Model', icon: DollarSign },
    { id: 'strategy', label: 'Go-to-Market', icon: Rocket },
    { id: 'growth', label: 'Growth Strategy', icon: TrendingUp },
    { id: 'finance', label: 'Finance & Funding', icon: Building2 },
    { id: 'swot', label: 'SWOT Analysis', icon: Shield },
    { id: 'marketing', label: 'Marketing Mix', icon: Zap },
    { id: 'content', label: 'Content Strategy', icon: Lightbulb },
    { id: 'pitch', label: 'Pitch Deck', icon: Users },
    { id: 'elevator', label: 'Elevator Pitch', icon: Clock }
  ];

  useEffect(() => {
    if (ideaName && ideaDescription) {
      performAnalysis();
    }
  }, [ideaName, ideaDescription]);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeStartupIdea(ideaName, ideaDescription);
      setAnalysis(result);
      setViewCount(prev => prev + 1);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (analysis && user) {
      try {
        // Save to backend
        const response = await fetch('/api/idea-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'uid': user.uid,
            'email': user.email || ''
          },
          body: JSON.stringify({
            ideaName,
            ideaDescription,
            analysis,
            metadata: {
              processingTime: Date.now(),
              confidence: 0.9,
              quality: 'excellent'
            }
          })
        });

        if (response.ok) {
          onSaveAnalysis?.(analysis);
        }
      } catch (err) {
        console.error('Failed to save analysis:', err);
      }
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Update backend
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Idea Analysis: ${ideaName}`,
          text: `Check out this comprehensive analysis of ${ideaName}`,
          url: window.location.href
        });
        setIsShared(true);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
    }
  };

  const handleRating = async (newRating: number) => {
    setRating(newRating);
    // TODO: Update backend
  };

  const renderSectionContent = () => {
    if (!analysis) return null;

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Executive Summary</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Overview</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.executive_summary.overview}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Vision</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.executive_summary.vision}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Mission</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.executive_summary.mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Problem Statement</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-lg mb-2 text-red-700 dark:text-red-300">The Problem</h4>
                  <p className={`${isDark ? 'text-red-200' : 'text-red-800'} leading-relaxed`}>
                    {analysis.problem_statement.one_line}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Why It Matters</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.problem_statement.why_it_matters}
                  </p>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Solution</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Our Solution</h4>
                  <p className={`${isDark ? 'text-green-200' : 'text-green-800'} leading-relaxed`}>
                    {analysis.solution.one_line}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">How It Works</h4>
                  <ul className="space-y-2">
                    {analysis.solution.how_it_works.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Key Benefits</h4>
                  <ul className="space-y-2">
                    {analysis.solution.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Star size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Unique Selling Proposition</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">What Makes Us Different</h4>
                  <p className={`${isDark ? 'text-blue-200' : 'text-blue-800'} leading-relaxed`}>
                    {analysis.unique_selling_proposition.one_line}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Key Differentiators</h4>
                  <ul className="space-y-2">
                    {analysis.unique_selling_proposition.key_differentiators.map((diff, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Zap size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Target Customer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Customer Segment</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.market_analysis.target_customer.segment}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Customer Persona</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis.market_analysis.target_customer.persona}
                  </p>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Market Size (TAM/SAM/SOM)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                  <h4 className="font-semibold text-lg mb-2">TAM</h4>
                  <p className="text-2xl font-bold">{analysis.market_analysis.market_size_tam_sam_som.TAM}</p>
                  <p className="text-sm opacity-90">Total Addressable Market</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                  <h4 className="font-semibold text-lg mb-2">SAM</h4>
                  <p className="text-2xl font-bold">{analysis.market_analysis.market_size_tam_sam_som.SAM}</p>
                  <p className="text-sm opacity-90">Serviceable Available Market</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
                  <h4 className="font-semibold text-lg mb-2">SOM</h4>
                  <p className="text-2xl font-bold">{analysis.market_analysis.market_size_tam_sam_som.SOM}</p>
                  <p className="text-sm opacity-90">Serviceable Obtainable Market</p>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Market Trends</h3>
              <ul className="space-y-3">
                {analysis.market_analysis.trends.map((trend, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <TrendingUp size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{trend}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Competitive Analysis</h3>
              <div className="space-y-4">
                {analysis.market_analysis.competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{competitor.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-600 dark:text-green-400 mb-1">Strengths</h5>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{competitor.strength}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-600 dark:text-red-400 mb-1">Weaknesses</h5>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{competitor.weakness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Revenue Streams</h3>
              <ul className="space-y-3">
                {analysis.business_model.revenue_streams.map((stream, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <DollarSign size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{stream}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Pricing Strategy</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.business_model.pricing_strategy}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Key Partnerships</h3>
              <ul className="space-y-3">
                {analysis.business_model.key_partnerships.map((partnership, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Users size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{partnership}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Launch Plan</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.go_to_market_strategy.launch_plan}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Distribution Channels</h3>
              <ul className="space-y-3">
                {analysis.go_to_market_strategy.distribution_channels.map((channel, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Globe size={20} className="text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{channel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Early Adopter Strategy</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.go_to_market_strategy.early_adopter_strategy}
              </p>
            </div>
          </div>
        );

      case 'growth':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Initial Traction Plan</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.growth_strategy.initial_traction_plan}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Scaling Plan</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.growth_strategy.scaling_plan}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Retention Plan</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.growth_strategy.retention_plan}
              </p>
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Startup Cost Estimate</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.finance.startup_cost_estimate}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Monetization Plan</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {analysis.finance.monetization_plan}
              </p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">Funding Stage & Ask</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Stage</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {analysis.finance.funding_stage_and_ask.stage}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Amount</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {analysis.finance.funding_stage_and_ask.amount}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Use of Funds</h4>
                  <ul className="space-y-2">
                    {analysis.finance.funding_stage_and_ask.use_of_funds.map((use, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'swot':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="modern-card p-6">
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.swot_analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-1" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modern-card p-6">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Weaknesses</h3>
                <ul className="space-y-2">
                  {analysis.swot_analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-1" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modern-card p-6">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Opportunities</h3>
                <ul className="space-y-2">
                  {analysis.swot_analysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <TrendingUp size={16} className="text-blue-500 flex-shrink-0 mt-1" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modern-card p-6">
                <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Threats</h3>
                <ul className="space-y-2">
                  {analysis.swot_analysis.threats.map((threat, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Shield size={16} className="text-orange-500 flex-shrink-0 mt-1" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">4Ps Marketing Mix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">Product</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis["4ps_marketing_mix"].product}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">Price</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis["4ps_marketing_mix"].price}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-400">Place</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis["4ps_marketing_mix"].place}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-orange-600 dark:text-orange-400">Promotion</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {analysis["4ps_marketing_mix"].promotion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">5-Day Content Plan</h3>
              <div className="space-y-4">
                {analysis.content_plan_5_days.map((day, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {day.day}
                      </div>
                      <h4 className="font-semibold text-lg">{day.theme}</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                      {day.post_example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pitch':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">7-Slide Pitch Deck Outline</h3>
              <div className="space-y-4">
                {analysis.pitch_deck_outline_7_slides.map((slide, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {slide.slide}
                      </div>
                      <h4 className="font-semibold text-lg">{slide.title}</h4>
                    </div>
                    <ul className="space-y-1">
                      {slide.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start space-x-2">
                          <span className="text-orange-500">•</span>
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'elevator':
        return (
          <div className="space-y-6">
            <div className="modern-card p-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">1-Minute Elevator Pitch</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-lg mb-2 text-orange-700 dark:text-orange-300">Hook</h4>
                  <p className={`${isDark ? 'text-orange-200' : 'text-orange-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.hook}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-lg mb-2 text-red-700 dark:text-red-300">Problem</h4>
                  <p className={`${isDark ? 'text-red-200' : 'text-red-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.problem}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Solution</h4>
                  <p className={`${isDark ? 'text-green-200' : 'text-green-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.solution}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Market</h4>
                  <p className={`${isDark ? 'text-blue-200' : 'text-blue-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.market}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">Traction/Potential</h4>
                  <p className={`${isDark ? 'text-purple-200' : 'text-purple-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.traction_or_potential}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-lg mb-2 text-yellow-700 dark:text-yellow-300">Closing</h4>
                  <p className={`${isDark ? 'text-yellow-200' : 'text-yellow-800'} leading-relaxed`}>
                    {analysis.elevator_pitch_1_minute.closing}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Idea</h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Our AI is conducting a comprehensive analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Analysis Failed</h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{error}</p>
        <button
          onClick={performAnalysis}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="modern-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">{ideaName}</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
              {ideaDescription}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-500 hover:text-white'
              }`}
            >
              <Bookmark size={20} />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-lg transition-colors ${
                isShared 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={handleSaveAnalysis}
              className="btn-primary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Save Analysis</span>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Eye size={16} className="text-gray-500" />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {viewCount} views
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-500" />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`transition-colors ${
                  rating && star <= rating 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
                }`}
              >
                <Star size={16} fill={rating && star <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="modern-card p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSectionContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ComprehensiveIdeaAnalysis;
