import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Bot, User, Zap, Brain, Lightbulb } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatbot: React.FC = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Co-Founder Assistant. I can help you with startup advice, strategy, fundraising, product development, and more. What would you like to discuss?"
    }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Check if Gemini API is configured
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
        // Fallback to local responses if Gemini is not configured
        return getLocalAIResponse(userMessage);
      }

      // Use Gemini API for real AI responses
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert startup advisor and AI co-founder assistant. Provide helpful, actionable advice for entrepreneurs and startup founders. Keep responses concise but comprehensive (2-3 paragraphs max). Focus on practical, actionable insights.

User question: ${userMessage}

Context: This is a startup platform called Setu Studios that helps founders with idea analysis, mentorship, and startup development.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalAIResponse(userMessage);
    } catch (error) {
      console.error('Gemini API error:', error);
      return getLocalAIResponse(userMessage);
    }
  };

  const getLocalAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('fundrais') || lowerMessage.includes('funding') || lowerMessage.includes('investor')) {
      return "For fundraising, I'd recommend: 1) Build a strong pitch deck highlighting your traction and market opportunity. 2) Network actively - attend startup events and leverage warm intros. 3) Focus on metrics that matter to investors. Would you like specific advice on pitch decks, investor outreach, or valuation?";
    } else if (lowerMessage.includes('mvp') || lowerMessage.includes('product') || lowerMessage.includes('build')) {
      return "Building an MVP? Here's my advice: 1) Start with core features only - resist feature creep. 2) Talk to 10-20 potential users before building anything. 3) Use no-code tools when possible to validate faster. 4) Aim for launch in 4-6 weeks max. What specific aspect of MVP development can I help with?";
    } else if (lowerMessage.includes('market') || lowerMessage.includes('competitor') || lowerMessage.includes('analysis')) {
      return "Market analysis is crucial! Here's what to focus on: 1) TAM/SAM/SOM - know your market size. 2) Study 3-5 direct competitors in detail. 3) Identify your unique differentiator. 4) Understand customer pain points deeply. Need help with competitor analysis or market sizing?";
    } else if (lowerMessage.includes('team') || lowerMessage.includes('co-founder') || lowerMessage.includes('hire')) {
      return "Building the right team is essential! Tips: 1) For co-founders, prioritize complementary skills and aligned values. 2) First hires should be T-shaped - deep expertise with broad skills. 3) Hire slow, fire fast. 4) Culture starts from day one. What's your specific team challenge?";
    } else if (lowerMessage.includes('growth') || lowerMessage.includes('marketing') || lowerMessage.includes('user')) {
      return "Growth strategies that work: 1) Content marketing - establish thought leadership. 2) Product-led growth - let your product sell itself. 3) Community building - engage your users actively. 4) Referral programs - leverage happy customers. 5) SEO - long-term organic traffic. Which channel interests you most?";
    } else if (lowerMessage.includes('pricing') || lowerMessage.includes('revenue') || lowerMessage.includes('monetiz')) {
      return "Pricing strategy tips: 1) Don't underprice - you can always discount later. 2) Test different tiers with real users. 3) Consider value-based pricing over cost-plus. 4) Offer annual plans for better cash flow. 5) Make pricing simple and transparent. What's your business model?";
    } else if (lowerMessage.includes('legal') || lowerMessage.includes('incorporate') || lowerMessage.includes('trademark')) {
      return "Legal foundations matter: 1) Incorporate early (consider Delaware C-Corp for VC funding). 2) Get founder agreements in writing from day one. 3) Protect your IP - trademarks, patents, copyrights. 4) Use standard contracts (YC SAFE notes are great). 5) Consult a startup lawyer for cap table setup. What legal aspect concerns you?";
    } else if (lowerMessage.includes('mentor') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      return "I'd recommend: 1) Check out our Mentorship Marketplace for domain experts. 2) Use the AI Idea Analyzer to validate your concept. 3) Read our Blog for real founder stories and insights. 4) Join startup communities on Twitter, Reddit (r/startups), and Discord. What specific guidance do you need?";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hello! Great to connect with you. I'm here to help with any startup-related questions. Whether it's about fundraising, product development, growth strategies, or just brainstorming - I'm all ears! What's on your mind?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Feel free to ask me anything else. I'm here to help you succeed. Good luck with your startup journey! 🚀";
    } else {
      return "Great question! Here's my take: Focus on solving a real problem that people are willing to pay for. Start small, validate quickly, and iterate based on user feedback. Remember, execution beats ideas - take action today! Can I help you with something more specific like fundraising, product development, or growth strategies?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await getAIResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 30px rgba(255, 102, 0, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:shadow-orange-500/50 group backdrop-blur-sm border-2 border-white/20"
            aria-label="Open AI Assistant"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Brain size={28} />
            </motion.div>
            <motion.span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] ${isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100vh-3rem)]'} rounded-2xl shadow-2xl backdrop-blur-xl ${isDark ? 'bg-slate-900/95 border border-orange-500/30' : 'bg-white/95 border border-orange-500/30'} flex flex-col overflow-hidden transition-all duration-300`}
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain size={20} />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">AI Co-Founder Assistant</h3>
                <motion.p 
                  className="text-xs text-white/80"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Always here to help
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <motion.div
                  animate={{ rotate: isMinimized ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X size={20} />
                </motion.div>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-orange-500' : 'bg-slate-600'}`}>
                    {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : isDark
                        ? 'bg-slate-800/80 backdrop-blur-sm text-gray-100 border border-slate-700'
                        : 'bg-gray-100/80 backdrop-blur-sm text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2">
                  <div className="p-2 rounded-full bg-slate-600">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${isDark ? 'bg-slate-800/80 backdrop-blur-sm border border-slate-700' : 'bg-gray-100/80 backdrop-blur-sm border border-gray-200'}`}>
                    <div className="flex gap-1">
                      <motion.div 
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          {!isMinimized && (
            <form onSubmit={handleSubmit} className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about startups..."
                className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
            </form>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
