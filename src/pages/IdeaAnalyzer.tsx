import React, { useState } from 'react';
import { 
  Brain, 
  Download, 
  Calendar, 
  Copy, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Target,
  Lightbulb,
  Presentation,
  Clock,
  BarChart3,
  Zap,
  Globe,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from '../components/AnimatedCard';
import { analyzeStartupIdea, StartupAnalysis } from '../services/gemini';

const IdeaAnalyzer: React.FC = () => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    ideaName: '',
    ideaDescription: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<StartupAnalysis | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // Always use real Gemini API
      const analysis = await analyzeStartupIdea(formData.ideaName, formData.ideaDescription);
      setAnalysisData(analysis);
      setShowResults(true);
      showNotification('Analysis completed successfully!', 'success');
    } catch (error) {
      showNotification('Analysis failed. Please check your API key and try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysisData) return;
    
    const text = `Startup Analysis for: ${formData.ideaName}

Executive Summary:
${analysisData.executive_summary.overview}

Vision: ${analysisData.executive_summary.vision}
Mission: ${analysisData.executive_summary.mission}

Problem Statement: ${analysisData.problem_statement.one_line}
Solution: ${analysisData.solution.one_line}
USP: ${analysisData.unique_selling_proposition.one_line}

Target Market: ${analysisData.market_analysis.target_customer.segment}
Market Size (TAM): ${analysisData.market_analysis.market_size_tam_sam_som.TAM}

Business Model: ${analysisData.business_model.pricing_strategy}
Revenue Streams: ${analysisData.business_model.revenue_streams.join(', ')}

Elevator Pitch:
${analysisData.elevator_pitch_1_minute.hook}
${analysisData.elevator_pitch_1_minute.problem}
${analysisData.elevator_pitch_1_minute.solution}
${analysisData.elevator_pitch_1_minute.market}
${analysisData.elevator_pitch_1_minute.traction_or_potential}
${analysisData.elevator_pitch_1_minute.closing}`;
    
    navigator.clipboard.writeText(text);
    showNotification('Analysis copied to clipboard!', 'success');
  };

  const downloadReport = () => {
    if (!analysisData) return;
    
    const reportContent = `
# 🚀 COMPREHENSIVE STARTUP ANALYSIS REPORT
## ${formData.ideaName}

**Generated on:** ${new Date().toLocaleDateString()}
**Analysis by:** StartupBuilderGPT AI

---

## 📋 EXECUTIVE SUMMARY

### Overview
${analysisData.executive_summary.overview}

### Vision
${analysisData.executive_summary.vision}

### Mission
${analysisData.executive_summary.mission}

---

## 🎯 PROBLEM STATEMENT

### Core Problem
${analysisData.problem_statement.one_line}

### Why It Matters
${analysisData.problem_statement.why_it_matters}

---

## 💡 SOLUTION

### Solution Description
${analysisData.solution.one_line}

### How It Works
${analysisData.solution.how_it_works.map((step, i) => `${i + 1}. ${step}`).join('\n')}

### Key Benefits
${analysisData.solution.benefits.map((benefit, _) => `• ${benefit}`).join('\n')}

---

## ⭐ UNIQUE SELLING PROPOSITION

### Main Differentiator
${analysisData.unique_selling_proposition.one_line}

### Key Differentiators
${analysisData.unique_selling_proposition.key_differentiators.map((diff, _) => `• ${diff}`).join('\n')}

---

## 📊 MARKET ANALYSIS

### Target Customer
**Segment:** ${analysisData.market_analysis.target_customer.segment}
**Persona:** ${analysisData.market_analysis.target_customer.persona}

### Market Size (TAM/SAM/SOM)
- **TAM (Total Addressable Market):** ${analysisData.market_analysis.market_size_tam_sam_som.TAM}
- **SAM (Serviceable Available Market):** ${analysisData.market_analysis.market_size_tam_sam_som.SAM}
- **SOM (Serviceable Obtainable Market):** ${analysisData.market_analysis.market_size_tam_sam_som.SOM}

### Market Trends
${analysisData.market_analysis.trends.map((trend, _) => `• ${trend}`).join('\n')}

### Competitors Analysis
${analysisData.market_analysis.competitors.map((competitor, _) => 
  `**${competitor.name}**
  - Strengths: ${competitor.strength}
  - Weaknesses: ${competitor.weakness}
`).join('\n')}

---

## 💼 BUSINESS MODEL

### Revenue Streams
${analysisData.business_model.revenue_streams.map((stream, _) => `• ${stream}`).join('\n')}

### Pricing Strategy
${analysisData.business_model.pricing_strategy}

### Key Partnerships
${analysisData.business_model.key_partnerships.map((partnership, _) => `• ${partnership}`).join('\n')}

---

## 🚀 GO-TO-MARKET STRATEGY

### Launch Plan
${analysisData.go_to_market_strategy.launch_plan}

### Distribution Channels
${analysisData.go_to_market_strategy.distribution_channels.map((channel, _) => `• ${channel}`).join('\n')}

### Early Adopter Strategy
${analysisData.go_to_market_strategy.early_adopter_strategy}

---

## 📈 GROWTH STRATEGY

### Initial Traction Plan
${analysisData.growth_strategy.initial_traction_plan}

### Scaling Plan
${analysisData.growth_strategy.scaling_plan}

### Retention Plan
${analysisData.growth_strategy.retention_plan}

---

## 💰 FINANCE & FUNDING

### Startup Cost Estimate
${analysisData.finance.startup_cost_estimate}

### Monetization Plan
${analysisData.finance.monetization_plan}

### Funding Stage & Ask
- **Stage:** ${analysisData.finance.funding_stage_and_ask.stage}
- **Amount:** ${analysisData.finance.funding_stage_and_ask.amount}
- **Use of Funds:**
${analysisData.finance.funding_stage_and_ask.use_of_funds.map((use, _) => `  • ${use}`).join('\n')}

---

## 🔍 SWOT ANALYSIS

### Strengths
${analysisData.swot_analysis.strengths.map((strength, _) => `• ${strength}`).join('\n')}

### Weaknesses
${analysisData.swot_analysis.weaknesses.map((weakness, _) => `• ${weakness}`).join('\n')}

### Opportunities
${analysisData.swot_analysis.opportunities.map((opportunity, _) => `• ${opportunity}`).join('\n')}

### Threats
${analysisData.swot_analysis.threats.map((threat, _) => `• ${threat}`).join('\n')}

---

## 🎯 4Ps MARKETING MIX

### Product
${analysisData["4ps_marketing_mix"].product}

### Price
${analysisData["4ps_marketing_mix"].price}

### Place
${analysisData["4ps_marketing_mix"].place}

### Promotion
${analysisData["4ps_marketing_mix"].promotion}

---

## 📱 CONTENT PLAN (5 Days)

${analysisData.content_plan_5_days.map(day => 
  `### Day ${day.day}: ${day.theme}
**Post Example:** ${day.post_example}
`).join('\n')}

---

## 🎤 PITCH DECK OUTLINE (7 Slides)

${analysisData.pitch_deck_outline_7_slides.map(slide => 
  `### Slide ${slide.slide}: ${slide.title}
${slide.points.map((point, _) => `• ${point}`).join('\n')}
`).join('\n')}

---

## 🎯 ELEVATOR PITCH (1 Minute)

### Hook
${analysisData.elevator_pitch_1_minute.hook}

### Problem
${analysisData.elevator_pitch_1_minute.problem}

### Solution
${analysisData.elevator_pitch_1_minute.solution}

### Market
${analysisData.elevator_pitch_1_minute.market}

### Traction/Potential
${analysisData.elevator_pitch_1_minute.traction_or_potential}

### Closing
${analysisData.elevator_pitch_1_minute.closing}

---

## 📞 NEXT STEPS

1. **Review this comprehensive analysis**
2. **Prioritize key action items based on your resources**
3. **Develop detailed implementation plans for critical sections**
4. **Create your pitch deck using the provided outline**
5. **Start executing your go-to-market strategy**
6. **Track progress against the growth strategy milestones**

---

*This report was generated by StartupBuilderGPT AI - Your comprehensive startup strategy partner.*

**Report ID:** ${Date.now()}
**Idea:** ${formData.ideaName}
**Description:** ${formData.ideaDescription}
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-startup-analysis-${formData.ideaName.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Comprehensive report downloaded successfully!', 'success');
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Idea Analyzer</h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Get AI-powered insights on your startup idea with comprehensive market analysis, validation, and strategic recommendations.
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Form Section */}
            <AnimatedCard className="mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Tell Us About Your Startup Idea</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                    Idea Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                    name="ideaName"
                    value={formData.ideaName}
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
                    Idea Description(*150 Words) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="ideaDescription"
                    value={formData.ideaDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Describe your startup idea in detail. What problem does it solve? How does it work? Who is your target audience? What makes it unique?"
                    />
                  </div>


                <button
                  type="submit"
                  disabled={isAnalyzing || !formData.ideaName || !formData.ideaDescription}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAnalyzing || !formData.ideaName || !formData.ideaDescription
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-orange-500/25'
                  } text-white`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Your Idea with AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={20} />
                      <span>Analyze My Startup Idea</span>
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
          analysisData && (
          <div className="space-y-8">
            {/* Header */}
            <AnimatedCard className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Brain size={32} className="text-orange-500" />
                  <h2 className="text-2xl font-bold">AI Analysis Complete!</h2>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Here's your comprehensive startup analysis for "{formData.ideaName}"
              </p>
            </AnimatedCard>

              {/* Executive Summary - Black Hero Section with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                      <Brain size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Executive Summary</h2>
                      <p className="text-gray-300 text-lg">Strategic Overview & Vision</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <h3 className="text-2xl font-bold text-blue-300">Overview</h3>
                      </div>
                      <p className="text-xl leading-relaxed text-gray-100">
                        {analysisData.executive_summary.overview}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                          <h4 className="text-xl font-bold text-yellow-300">Vision</h4>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-100">
                          {analysisData.executive_summary.vision}
                        </p>
                      </div>
                      
                      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                          <h4 className="text-xl font-bold text-green-300">Mission</h4>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-100">
                          {analysisData.executive_summary.mission}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem & Solution - Black Theme with Infographics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Problem Statement */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-red-900 to-black p-8 text-white">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg shadow-red-500/30">
                        <AlertTriangle size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">The Problem</h3>
                        <p className="text-gray-300 text-lg">Critical Issues to Address</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-800/50 to-red-900/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
                          <h4 className="text-xl font-bold text-red-300">Core Problem</h4>
                        </div>
                        <h5 className="font-bold text-2xl mb-4 text-white">
                          {analysisData.problem_statement.one_line}
                        </h5>
                        <p className="text-gray-200 text-lg leading-relaxed">
                          {analysisData.problem_statement.why_it_matters}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-green-900 to-black p-8 text-white">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/30">
                        <Lightbulb size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Our Solution</h3>
                        <p className="text-gray-300 text-lg">Innovative Approach</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-800/50 to-green-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                          <h4 className="text-xl font-bold text-green-300">Solution Overview</h4>
                        </div>
                        <h5 className="font-bold text-2xl mb-4 text-white">
                          {analysisData.solution.one_line}
                        </h5>
                        <div className="space-y-4">
                          <h6 className="font-semibold text-lg text-green-300 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>How it works:</span>
                          </h6>
                          <ul className="space-y-3">
                            {analysisData.solution.how_it_works.map((point, index) => (
                              <li key={index} className="flex items-start space-x-3 p-3 bg-green-900/20 rounded-lg">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0 shadow-lg shadow-green-400/50"></div>
                                <span className="text-gray-200 text-lg leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

              {/* USP - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30">
                      <Zap size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Unique Selling Proposition</h3>
                      <p className="text-gray-300 text-lg">Competitive Advantages</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-gray-800/50 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                        <h4 className="text-2xl font-bold text-purple-300">Core USP</h4>
                      </div>
                      <h5 className="font-bold text-3xl mb-6 text-white">
                        {analysisData.unique_selling_proposition.one_line}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysisData.unique_selling_proposition.key_differentiators.map((point, index) => (
                          <div key={index} className="flex items-start space-x-4 p-6 bg-black/50 rounded-xl border border-purple-500/20">
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>

              {/* Market Analysis - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30">
                      <BarChart3 size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Market Analysis</h3>
                      <p className="text-gray-300 text-lg">Market Intelligence & Insights</p>
                </div>
            </div>

                  <div className="space-y-8">
                    {/* Target Customer */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                        <h4 className="text-2xl font-bold text-blue-300">Target Customer</h4>
                      </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-black/50 rounded-xl border border-blue-500/20">
                          <h5 className="font-bold text-xl text-blue-300 mb-4 flex items-center space-x-2">
                            <Users size={20} />
                            <span>Segment</span>
                          </h5>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {analysisData.market_analysis.target_customer.segment}
                          </p>
                        </div>
                        <div className="p-6 bg-black/50 rounded-xl border border-blue-500/20">
                          <h5 className="font-bold text-xl text-blue-300 mb-4 flex items-center space-x-2">
                            <Target size={20} />
                            <span>Persona</span>
                          </h5>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {analysisData.market_analysis.target_customer.persona}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Market Size - Infographic Style */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                        <h4 className="text-2xl font-bold text-cyan-300">Market Size Analysis</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-black/50 rounded-2xl border border-blue-500/30">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <span className="text-2xl font-bold text-white">TAM</span>
                          </div>
                          <div className="text-2xl font-bold text-white mb-3">Total Addressable Market</div>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {analysisData.market_analysis.market_size_tam_sam_som.TAM}
                          </p>
                        </div>
                        <div className="text-center p-8 bg-black/50 rounded-2xl border border-cyan-500/30">
                          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                            <span className="text-2xl font-bold text-white">SAM</span>
                          </div>
                          <div className="text-2xl font-bold text-white mb-3">Serviceable Available Market</div>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {analysisData.market_analysis.market_size_tam_sam_som.SAM}
                          </p>
                        </div>
                        <div className="text-center p-8 bg-black/50 rounded-2xl border border-indigo-500/30">
                          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                            <span className="text-2xl font-bold text-white">SOM</span>
                          </div>
                          <div className="text-2xl font-bold text-white mb-3">Serviceable Obtainable Market</div>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {analysisData.market_analysis.market_size_tam_sam_som.SOM}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Competitors */}
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                        <h4 className="text-2xl font-bold text-yellow-300">Key Competitors</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysisData.market_analysis.competitors.map((competitor, index) => (
                          <div key={index} className="p-6 bg-black/50 rounded-2xl border border-gray-600/30">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              <h5 className="font-bold text-xl text-white">{competitor.name}</h5>
                            </div>
                            <div className="space-y-4">
                              <div className="p-4 bg-black/70 rounded-xl border border-green-500/30">
                                <span className="text-sm font-semibold text-green-300 flex items-center space-x-2 mb-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span>Strengths</span>
                                </span>
                                <p className="text-gray-200 text-base leading-relaxed">{competitor.strength}</p>
                              </div>
                              <div className="p-4 bg-black/70 rounded-xl border border-red-500/30">
                                <span className="text-sm font-semibold text-red-300 flex items-center space-x-2 mb-2">
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                  <span>Weaknesses</span>
                                </span>
                                <p className="text-gray-200 text-base leading-relaxed">{competitor.weakness}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Go-to-Market Strategy - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg shadow-orange-500/30">
                      <Target size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Go-to-Market Strategy</h3>
                      <p className="text-gray-300 text-lg">Launch & Distribution Strategy</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
                        <h4 className="text-2xl font-bold text-orange-300">Launch Plan</h4>
                      </div>
                      <p className="text-gray-200 text-lg leading-relaxed">
                        {analysisData.go_to_market_strategy.launch_plan}
                      </p>
                    </div>
                    
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
                        <h4 className="text-2xl font-bold text-red-300">Distribution Channels</h4>
                      </div>
                      <ul className="space-y-4">
                        {analysisData.go_to_market_strategy.distribution_channels.map((channel: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-black/70 rounded-lg">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0 shadow-lg shadow-red-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{channel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                        <h4 className="text-2xl font-bold text-yellow-300">Early Adopter Strategy</h4>
                      </div>
                      <p className="text-gray-200 text-lg leading-relaxed">
                        {analysisData.go_to_market_strategy.early_adopter_strategy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Model - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-emerald-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg shadow-emerald-500/30">
                      <TrendingUp size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Business Model</h3>
                      <p className="text-gray-300 text-lg">Revenue & Partnership Strategy</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Revenue Streams */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                        <h4 className="text-2xl font-bold text-emerald-300">Revenue Streams</h4>
                </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysisData.business_model.revenue_streams.map((stream, index) => (
                          <div key={index} className="flex items-center space-x-4 p-6 bg-black/50 rounded-xl border border-emerald-500/20">
                            <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                            <span className="text-gray-200 text-lg font-medium">{stream}</span>
                    </div>
                  ))}
                </div>
                    </div>

                    {/* Pricing Strategy */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                        <h4 className="text-2xl font-bold text-green-300">Pricing Strategy</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed">
                        {analysisData.business_model.pricing_strategy}
                      </p>
                    </div>

                    {/* Key Partnerships */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50"></div>
                        <h4 className="text-2xl font-bold text-teal-300">Key Partnerships</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysisData.business_model.key_partnerships.map((partner, index) => (
                          <div key={index} className="flex items-center space-x-4 p-6 bg-black/50 rounded-xl border border-teal-500/20">
                            <div className="w-4 h-4 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-lg shadow-teal-400/50"></div>
                            <span className="text-gray-200 text-lg font-medium">{partner}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance & Funding - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-yellow-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/30">
                      <BarChart3 size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Finance & Funding</h3>
                      <p className="text-gray-300 text-lg">Financial Strategy & Investment</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Startup Cost */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-yellow-900/30 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                        <h4 className="text-2xl font-bold text-yellow-300">Startup Cost Estimate</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed">
                        {analysisData.finance.startup_cost_estimate}
                      </p>
                    </div>

                    {/* Monetization Plan */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-orange-900/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
                        <h4 className="text-2xl font-bold text-orange-300">Monetization Plan</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed">
                        {analysisData.finance.monetization_plan}
                      </p>
                    </div>

                    {/* Funding Details - Infographic Style */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-red-900/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
                        <h4 className="text-2xl font-bold text-red-300">Funding Stage & Ask</h4>
                      </div>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="text-center p-8 bg-black/50 rounded-2xl border border-yellow-500/30">
                            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                              <span className="text-2xl font-bold text-white">S</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-3">Funding Stage</div>
                            <div className="text-gray-200 text-lg">
                              {analysisData.finance.funding_stage_and_ask.stage}
                            </div>
                          </div>
                          <div className="text-center p-8 bg-black/50 rounded-2xl border border-orange-500/30">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                              <span className="text-2xl font-bold text-white">$</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-3">Funding Amount</div>
                            <div className="text-gray-200 text-lg">
                              {analysisData.finance.funding_stage_and_ask.amount}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-bold text-xl text-red-300 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span>Use of Funds</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {analysisData.finance.funding_stage_and_ask.use_of_funds.map((use, index) => (
                              <div key={index} className="flex items-center space-x-4 p-6 bg-black/50 rounded-xl border border-red-500/20">
                                <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full shadow-lg shadow-red-400/50"></div>
                                <span className="text-gray-200 text-lg font-medium">{use}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SWOT Analysis - Black Theme with Enhanced Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30">
                      <Target size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">SWOT Analysis</h3>
                      <p className="text-gray-300 text-lg">Strategic Assessment Matrix</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Strengths */}
                    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg shadow-green-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Strengths</h4>
                      </div>
                      <ul className="space-y-4">
                        {analysisData.swot_analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-black/50 rounded-lg">
                            <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-green-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full shadow-lg shadow-red-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Weaknesses</h4>
                      </div>
                      <ul className="space-y-4">
                        {analysisData.swot_analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-black/50 rounded-lg">
                            <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-red-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Opportunities</h4>
                      </div>
                      <ul className="space-y-4">
                        {analysisData.swot_analysis.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-black/50 rounded-lg">
                            <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-blue-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Threats</h4>
                      </div>
                      <ul className="space-y-4">
                        {analysisData.swot_analysis.threats.map((threat, index) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-black/50 rounded-lg">
                            <div className="w-3 h-3 bg-orange-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-orange-400/50"></div>
                            <span className="text-gray-200 text-lg leading-relaxed font-medium">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Trends - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/30">
                      <Globe size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Market Trends</h3>
                      <p className="text-gray-300 text-lg">Industry Insights & Future Outlook</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {analysisData.market_analysis.trends.map((trend, index) => (
                      <div key={index} className="p-8 bg-black/50 backdrop-blur-sm rounded-2xl border border-indigo-500/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-lg shadow-indigo-400/50"></div>
                          <span className="text-indigo-300 font-bold text-lg">Trend #{index + 1}</span>
                        </div>
                        <p className="text-gray-200 text-lg leading-relaxed font-medium">{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Plan - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-pink-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-rose-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-500/30">
                      <MessageSquare size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">5-Day Content Plan</h3>
                      <p className="text-gray-300 text-lg">Strategic Content Marketing</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {analysisData.content_plan_5_days.map((day) => (
                      <div key={day.day} className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30">
                        <div className="text-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
                            <span className="text-white font-bold text-lg">Day {day.day}</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-xl mb-4 text-white text-center">{day.theme}</h4>
                        <p className="text-gray-200 text-lg leading-relaxed text-center">
                          {day.post_example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pitch Deck Outline - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/30">
                      <Presentation size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">7-Slide Pitch Deck Outline</h3>
                      <p className="text-gray-300 text-lg">Investor Presentation Framework</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {analysisData.pitch_deck_outline_7_slides.map((slide) => (
                      <div key={slide.slide} className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-indigo-500">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-bold text-lg">{slide.slide}</span>
                          </div>
                          <h4 className="font-bold text-2xl text-white">{slide.title}</h4>
                        </div>
                        <ul className="space-y-4">
                          {slide.points.map((point, index) => (
                            <li key={index} className="flex items-start space-x-4 p-4 bg-black/70 rounded-xl">
                              <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-indigo-400/50"></div>
                              <span className="text-gray-200 text-lg leading-relaxed font-medium">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Elevator Pitch - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-yellow-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/30">
                      <Clock size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">1-Minute Elevator Pitch</h3>
                      <p className="text-gray-300 text-lg">Compelling Story Framework</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Hook */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Hook</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.hook}
                      </p>
                    </div>

                    {/* Problem */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full shadow-lg shadow-red-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Problem</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.problem}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg shadow-green-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Solution</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.solution}
                      </p>
                    </div>

                    {/* Market */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Market</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.market}
                      </p>
                    </div>

                    {/* Traction/Potential */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Traction/Potential</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.traction_or_potential}
                      </p>
                    </div>

                    {/* Closing */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                        <h4 className="font-bold text-white text-2xl">Closing</h4>
                      </div>
                      <p className="text-gray-200 text-xl leading-relaxed font-medium">
                        {analysisData.elevator_pitch_1_minute.closing}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Black Theme with Infographics */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-900 to-black p-8 text-white mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20"></div>
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg shadow-orange-500/30">
                        <Target size={32} className="text-white" />
                      </div>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Ready to Take Action?</h3>
                    </div>
                    <p className="text-gray-300 text-xl">Download your analysis or book a strategy call</p>
            </div>

                  <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button 
                      onClick={downloadReport}
                      className="group/btn relative px-12 py-6 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:from-orange-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center space-x-4 border border-orange-500/30"
              >
                      <Download size={28} className="relative z-10" />
                      <span className="relative z-10 text-xl">Download Report</span>
              </button>
                    
              <button 
                onClick={() => {}}
                      className="group/btn relative px-12 py-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-4 border border-blue-500/30"
              >
                      <Calendar size={28} className="relative z-10" />
                      <span className="relative z-10 text-xl">Book Strategy Call</span>
              </button>
                    
              <button 
                onClick={copyToClipboard}
                      className="group/btn relative px-12 py-6 bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:from-gray-500/30 hover:to-slate-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center space-x-4 border border-gray-500/30"
              >
                      <Copy size={28} className="relative z-10" />
                      <span className="relative z-10 text-xl">Copy Results</span>
              </button>
                  </div>
                </div>
            </div>

              {/* Try Another Idea - Black Theme */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                <div className="relative z-10 text-center">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/30">
                      <RefreshCw size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Ready for Another Analysis?</h3>
                  </div>
              <button 
                onClick={() => {
                  setShowResults(false);
                      setAnalysisData(null);
                  setFormData({
                        ideaName: '',
                        ideaDescription: ''
                  });
                }}
                    className="group relative px-12 py-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:from-indigo-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center space-x-4 mx-auto border border-indigo-500/30"
              >
                    <RefreshCw size={28} className="relative z-10" />
                    <span className="relative z-10 text-xl">Analyze Another Idea</span>
              </button>
            </div>
          </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default IdeaAnalyzer;