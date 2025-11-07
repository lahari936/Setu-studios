import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Clock,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  History,
  Settings,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import AnimatedCard from './AnimatedCard';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type: 'text' | 'analysis' | 'recommendation' | 'action';
  metadata?: {
    confidence?: number;
    sources?: string[];
    actionItems?: string[];
  };
}

interface UserContext {
  role: string;
  startupStage: string;
  industry: string;
  interests: string[];
  experience: string;
  currentChallenges: string[];
  goals: string[];
}

interface CoFounderXCapabilities {
  ideaEvaluation: boolean;
  productGuidance: boolean;
  fundingAdvisor: boolean;
  marketAnalysis: boolean;
  competitorResearch: boolean;
  pitchDeckReview: boolean;
  businessModelCanvas: boolean;
  leanCanvas: boolean;
}

const CoFounderX2: React.FC = () => {
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const capabilities: CoFounderXCapabilities = {
    ideaEvaluation: true,
    productGuidance: true,
    fundingAdvisor: true,
    marketAnalysis: true,
    competitorResearch: true,
    pitchDeckReview: true,
    businessModelCanvas: true,
    leanCanvas: true
  };

  const capabilityIcons = {
    ideaEvaluation: Lightbulb,
    productGuidance: Target,
    fundingAdvisor: TrendingUp,
    marketAnalysis: BarChart3,
    competitorResearch: Users,
    pitchDeckReview: BookOpen,
    businessModelCanvas: BarChart3,
    leanCanvas: BarChart3
  };

  useEffect(() => {
    // Load user context from profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserContext({
        role: profile.role,
        startupStage: profile.startupStage,
        industry: profile.industry,
        interests: profile.interests || [],
        experience: profile.experience,
        currentChallenges: [],
        goals: [profile.goal]
      });
    }

    // Load conversation history
    const savedConversations = localStorage.getItem('cofounderx-conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getContextualPrompt = (userMessage: string): string => {
    if (!userContext) return userMessage;
    
    return `You are CoFounderX 2.0, an advanced AI co-founder assistant with context-aware capabilities. 

User Context:
- Role: ${userContext.role}
- Startup Stage: ${userContext.startupStage}
- Industry: ${userContext.industry}
- Experience: ${userContext.experience}
- Interests: ${userContext.interests.join(', ')}
- Goals: ${userContext.goals.join(', ')}

User Question: ${userMessage}

Provide contextually relevant, actionable advice based on their specific situation. Include:
1. Specific recommendations for their stage and industry
2. Practical next steps
3. Relevant frameworks or tools
4. Potential challenges and solutions
5. Resource suggestions

Keep responses comprehensive but concise (2-3 paragraphs max). Focus on practical, actionable insights.`;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    // Create new conversation if none exists
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: currentMessage.substring(0, 50) + (currentMessage.length > 50 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'general'
      };
      setCurrentConversation(newConversation);
      setConversations(prev => [newConversation, ...prev]);
    } else {
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: new Date().toISOString()
      };
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        [updatedConversation, ...prev.filter(c => c.id !== updatedConversation.id)]
      );
    }

    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Simulate AI response with contextual awareness
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateContextualResponse(currentMessage),
        timestamp: new Date().toISOString(),
        type: 'analysis',
        metadata: {
          confidence: 0.92,
          sources: ['Startup Playbook', 'Industry Reports', 'Best Practices'],
          actionItems: [
            'Research target market size',
            'Create MVP wireframes',
            'Identify key competitors'
          ]
        }
      };

      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, aiResponse],
          updatedAt: new Date().toISOString()
        };
        setCurrentConversation(updatedConversation);
        setConversations(prev => 
          [updatedConversation, ...prev.filter(c => c.id !== updatedConversation.id)]
        );
      }
    } catch (error) {
      showNotification('Failed to get AI response. Please try again.', 'error');
    } finally {
      setIsTyping(false);
    }

    // Save conversations
    localStorage.setItem('cofounderx-conversations', JSON.stringify(conversations));
  };

  const generateContextualResponse = (userMessage: string): string => {
    // This would normally call the Gemini API with contextual prompt
    // For now, return a contextual response based on user context
    const responses = {
      idea: `Based on your ${userContext?.startupStage} stage in ${userContext?.industry}, here's my analysis:

Your idea shows strong potential in the current market. Given your ${userContext?.experience} experience level, I recommend focusing on:

1. **Market Validation**: Conduct 50+ customer interviews to validate your core assumptions
2. **MVP Strategy**: Build a minimal version focusing on your key differentiator
3. **Competitive Positioning**: Analyze 3-5 direct competitors and identify your unique value proposition

Next steps: Create a lean canvas, develop user personas, and start building your MVP wireframes. Would you like me to help you with any of these specific areas?`,

      funding: `For your ${userContext?.startupStage} stage startup in ${userContext?.industry}, here's your funding roadmap:

**Pre-Seed Stage** (where you are):
- Target: $50K-$250K
- Focus: Product-market fit validation
- Investors: Angel investors, accelerators, friends & family

**Key Preparation**:
1. **Financial Model**: 3-year projections with clear assumptions
2. **Pitch Deck**: 10-12 slides focusing on problem, solution, market size
3. **Traction Metrics**: User growth, revenue, engagement data

**Recommended Timeline**: 3-6 months preparation before approaching investors. Would you like me to help you create your pitch deck outline or financial model?`,

      product: `Given your ${userContext?.industry} focus and ${userContext?.startupStage} stage, here's your product development strategy:

**Technical Architecture**:
- Start with no-code/low-code solutions (Bubble, Webflow, Zapier)
- Focus on core user journey first
- Plan for scalability from day one

**Development Phases**:
1. **MVP** (2-3 months): Core features only
2. **Beta** (1-2 months): Limited user testing
3. **Launch** (1 month): Public release with feedback loop

**Key Metrics to Track**: User acquisition, retention, engagement, and conversion rates. Would you like me to help you define your technical requirements or create a development roadmap?`
    };

    // Simple keyword matching for demo
    if (userMessage.toLowerCase().includes('idea') || userMessage.toLowerCase().includes('concept')) {
      return responses.idea;
    } else if (userMessage.toLowerCase().includes('funding') || userMessage.toLowerCase().includes('investor')) {
      return responses.funding;
    } else if (userMessage.toLowerCase().includes('product') || userMessage.toLowerCase().includes('development')) {
      return responses.product;
    }

    return `I understand you're working on ${userContext?.industry} at the ${userContext?.startupStage} stage. Based on your ${userContext?.experience} experience level, here's my recommendation:

Your question touches on a critical aspect of startup success. Given your current stage, I recommend focusing on [specific advice based on context]. 

Key next steps:
1. [Actionable step 1]
2. [Actionable step 2] 
3. [Actionable step 3]

Would you like me to dive deeper into any of these areas or help you with a specific framework?`;
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setCurrentMessage("I need help with my startup idea validation");
      setIsListening(false);
    }, 2000);
  };

  const loadConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowHistory(false);
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setShowHistory(false);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'analysis': return BarChart3;
      case 'recommendation': return Lightbulb;
      case 'action': return Target;
      default: return MessageSquare;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse"
        >
          <Brain size={32} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`w-full max-w-4xl mx-4 rounded-2xl shadow-2xl border-2 ${
        isDark ? 'bg-slate-900 border-sarbuzz-primary' : 'bg-white border-sarbuzz-primary'
      } overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-sarbuzz-primary to-sarbuzz-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Brain size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">CoFounderX 2.0</h2>
                <p className="text-white/80">Your AI Co-founder Assistant</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCapabilities(!showCapabilities)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                <History size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Capabilities Panel */}
        {showCapabilities && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b">
            <h3 className="text-lg font-semibold mb-4">CoFounderX 2.0 Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(capabilities).map(([capability, enabled]) => {
                const Icon = capabilityIcons[capability as keyof typeof capabilityIcons];
                return (
                  <div key={capability} className={`p-3 rounded-lg border-2 ${
                    enabled ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <Icon size={24} className={`mb-2 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    <div className="text-sm font-medium capitalize">
                      {capability.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Conversation History</h3>
              <button
                onClick={startNewConversation}
                className="px-4 py-2 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300"
              >
                New Chat
              </button>
            </div>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => loadConversation(conversation)}
                  className="w-full p-3 text-left bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="font-medium">{conversation.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentConversation?.messages.map((message) => {
              const MessageIcon = getMessageIcon(message.type);
              return (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-sarbuzz-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageIcon size={16} className="text-sarbuzz-primary" />
                        <span className="text-xs font-medium text-sarbuzz-primary">
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.metadata && (
                      <div className="mt-2 text-xs opacity-75">
                        {message.metadata.confidence && (
                          <div>Confidence: {Math.round(message.metadata.confidence * 100)}%</div>
                        )}
                        {message.metadata.actionItems && message.metadata.actionItems.length > 0 && (
                          <div className="mt-1">
                            <div className="font-medium">Action Items:</div>
                            <ul className="list-disc list-inside ml-2">
                              {message.metadata.actionItems.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex space-x-3">
              <button
                onClick={startVoiceInput}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask CoFounderX anything about your startup..."
                className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sarbuzz-primary focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="px-6 py-3 bg-sarbuzz-primary text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoFounderX2;
