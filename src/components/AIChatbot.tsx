import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-orange-500/50 group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border-2 border-orange-500/30' : 'bg-white border-2 border-orange-500/30'} flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Co-Founder Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : isDark
                      ? 'bg-slate-800 text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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
        </div>
      )}
    </>
  );
};

export default AIChatbot;
