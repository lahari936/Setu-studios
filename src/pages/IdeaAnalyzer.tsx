import React, { useState } from 'react';
import { 
  Brain, 
  Send, 
  Download, 
  Calendar, 
  Copy, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';

const IdeaAnalyzer: React.FC = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    ideaTitle: '',
    description: '',
    targetAudience: '',
    industry: '',
    timeline: '',
    budget: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const analysisResults = {
    overallScore: 7.8,
    marketSize: '$2.3B',
    competitionLevel: 'Medium',
    viabilityScore: 8.2,
    timeToMarket: '6-8 months',
    estimatedCosts: '$50K - $100K',
    strengths: [
      'Large addressable market with growing demand',
      'Unique value proposition in underserved niche',
      'Low technical complexity for MVP',
      'Strong potential for viral growth'
    ],
    challenges: [
      'High customer acquisition costs in early stages',
      'Need for regulatory compliance in some markets',
      'Established competitors with deep pockets',
      'Seasonal demand fluctuations'
    ],
    recommendations: [
      'Focus on a specific vertical initially to reduce competition',
      'Build strong partnerships for customer acquisition',
      'Develop a freemium model to lower barrier to entry',
      'Consider geographic expansion strategy early'
    ],
    marketTrends: [
      'Remote work adoption driving 40% market growth',
      'AI integration becoming table stakes',
      'Privacy concerns creating opportunities',
      'Mobile-first approach essential'
    ]
  };

  const copyToClipboard = () => {
    const text = `AI Analysis Results for: ${formData.ideaTitle}
    
Overall Score: ${analysisResults.overallScore}/10
Market Size: ${analysisResults.marketSize}
Competition Level: ${analysisResults.competitionLevel}
Viability Score: ${analysisResults.viabilityScore}/10

Key Strengths:
${analysisResults.strengths.map(s => `• ${s}`).join('\n')}

Challenges to Address:
${analysisResults.challenges.map(c => `• ${c}`).join('\n')}

Recommendations:
${analysisResults.recommendations.map(r => `• ${r}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            <Brain size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Idea Analyzer</h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Get AI-powered insights on your startup idea with comprehensive market analysis, validation, and strategic recommendations.
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Form Section */}
            <AnimatedCard className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Tell Us About Your Idea</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Idea Title *
                    </label>
                    <input
                      type="text"
                      name="ideaTitle"
                      value={formData.ideaTitle}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., AI-powered task management for remote teams"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select Industry</option>
                      <option value="saas">SaaS</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="fintech">FinTech</option>
                      <option value="healthtech">HealthTech</option>
                      <option value="edtech">EdTech</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Idea Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Describe your startup idea, the problem it solves, and how it works..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., Small business owners, Remote workers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select Timeline</option>
                      <option value="3months">3 months</option>
                      <option value="6months">6 months</option>
                      <option value="1year">1 year</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Budget</option>
                    <option value="under25k">Under $25K</option>
                    <option value="25k-50k">$25K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k-250k">$100K - $250K</option>
                    <option value="over250k">Over $250K</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !formData.ideaTitle || !formData.description || !formData.industry}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAnalyzing || !formData.ideaTitle || !formData.description || !formData.industry
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-orange-500/25'
                  } text-white`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Your Idea...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Analyze My Idea</span>
                    </>
                  )}
                </button>
              </form>
            </AnimatedCard>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedCard className="text-center">
                <TrendingUp size={32} className="text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive market size, trends, and opportunity assessment
                </p>
              </AnimatedCard>

              <AnimatedCard className="text-center">
                <Users size={32} className="text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Competition Research</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Detailed competitive landscape and positioning analysis
                </p>
              </AnimatedCard>

              <AnimatedCard className="text-center">
                <Target size={32} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strategic Recommendations</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Actionable insights and next steps for your startup journey
                </p>
              </AnimatedCard>
            </div>
          </>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Header */}
            <AnimatedCard className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Brain size={32} className="text-orange-500" />
                <h2 className="text-2xl font-bold">Analysis Complete!</h2>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Here's what our AI discovered about "{formData.ideaTitle}"
              </p>
            </AnimatedCard>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatedCard className="text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {analysisResults.overallScore}/10
                </div>
                <div className="text-sm font-medium">Overall Score</div>
              </AnimatedCard>

              <AnimatedCard className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {analysisResults.marketSize}
                </div>
                <div className="text-sm font-medium">Market Size</div>
              </AnimatedCard>

              <AnimatedCard className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {analysisResults.viabilityScore}/10
                </div>
                <div className="text-sm font-medium">Viability</div>
              </AnimatedCard>

              <AnimatedCard className="text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">
                  {analysisResults.timeToMarket}
                </div>
                <div className="text-sm font-medium">Time to Market</div>
              </AnimatedCard>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strengths */}
              <AnimatedCard>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle size={24} className="text-green-500" />
                  <h3 className="text-xl font-bold">Key Strengths</h3>
                </div>
                <div className="space-y-3">
                  {analysisResults.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {strength}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Challenges */}
              <AnimatedCard>
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle size={24} className="text-yellow-500" />
                  <h3 className="text-xl font-bold">Challenges to Address</h3>
                </div>
                <div className="space-y-3">
                  {analysisResults.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Recommendations */}
              <AnimatedCard>
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb size={24} className="text-orange-500" />
                  <h3 className="text-xl font-bold">Strategic Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Market Trends */}
              <AnimatedCard>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp size={24} className="text-blue-500" />
                  <h3 className="text-xl font-bold">Market Trends</h3>
                </div>
                <div className="space-y-3">
                  {analysisResults.marketTrends.map((trend, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {trend}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {}}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Download PDF Report</span>
              </button>
              <button 
                onClick={() => {}}
                className={`px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
              >
                <Calendar size={20} />
                <span>Book Strategy Call</span>
              </button>
              <button 
                onClick={copyToClipboard}
                className={`px-8 py-3 ${isDark ? 'border-2 border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-2 border-gray-300 text-gray-600 hover:bg-gray-100'} rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
              >
                <Copy size={20} />
                <span>Copy Results</span>
              </button>
            </div>

            {/* Try Another Idea */}
            <div className="text-center">
              <button 
                onClick={() => {
                  setShowResults(false);
                  setFormData({
                    ideaTitle: '',
                    description: '',
                    targetAudience: '',
                    industry: '',
                    timeline: '',
                    budget: ''
                  });
                }}
                className={`text-orange-500 hover:text-orange-600 font-medium underline`}
              >
                Analyze Another Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaAnalyzer;