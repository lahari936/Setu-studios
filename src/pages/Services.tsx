import React, { useState } from 'react';
import { 
  Brain, 
  Palette, 
  Code, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Target,
  Phone,
  Mail,
  Search,
  FileText,
  Users,
  Brush,
  Globe,
  Monitor,
  Smartphone,
  Presentation,
  Calculator,
  MessageCircle,
  Rocket
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const { isDark } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<null | typeof services[0]>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (service: typeof services[0]) => {
    setSelectedService(service);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const services = [
    // Strategy & Business Design Services
    {
      icon: Search,
      title: 'Market Research',
      description: 'Comprehensive market analysis including competitor scan, market size estimation, and detailed persona profiles.',
      features: [
        'Competitor analysis and benchmarking',
        'Market size estimation and validation',
        'Target audience persona development',
        'Industry trend analysis',
        'SWOT analysis report'
      ],
      timeline: '3 Days',
      price: '₹99',
      color: 'from-blue-500 to-blue-600',
      category: 'Strategy & Business Design'
    },
    {
      icon: FileText,
      title: 'Product Requirement Document (PRD)',
      description: 'Detailed product specification including features list, tech stack recommendations, and comprehensive user journeys.',
      features: [
        'Feature prioritization and roadmap',
        'Technical architecture planning',
        'User journey mapping',
        'Functional requirements specification',
        'Success metrics definition'
      ],
      timeline: '4 Days',
      price: '₹149',
      color: 'from-blue-500 to-blue-600',
      category: 'Strategy & Business Design'
    },
    {
      icon: Users,
      title: 'Business Model + GTM Strategy',
      description: 'Complete business model design with revenue streams, distribution strategy, and growth roadmap.',
      features: [
        'Revenue model design and validation',
        'Go-to-market strategy development',
        'Distribution channel planning',
        'Growth roadmap and milestones',
        'Pricing strategy optimization'
      ],
      timeline: '3 Days',
      price: '₹179',
      color: 'from-blue-500 to-blue-600',
      category: 'Strategy & Business Design'
    },
    
    // Design & Branding Services
    {
      icon: Brush,
      title: 'Brand Kit',
      description: 'Complete brand identity including logo, typography, color palette, and comprehensive visual language guide.',
      features: [
        'Logo design and variations',
        'Typography system and hierarchy',
        'Color palette and brand guidelines',
        'Visual language and style guide',
        'Brand asset library'
      ],
      timeline: '2-3 Days',
      price: '₹139',
      color: 'from-purple-500 to-purple-600',
      category: 'Design & Branding'
    },
    {
      icon: Globe,
      title: 'Landing Page',
      description: 'SEO-optimized landing page with compelling copywriting and strategic call-to-action placement.',
      features: [
        'SEO-optimized content and structure',
        'Compelling copywriting and messaging',
        'Strategic CTA placement and design',
        'Mobile-responsive design',
        'Conversion optimization'
      ],
      timeline: '4 Days',
      price: '₹349-499',
      color: 'from-purple-500 to-purple-600',
      category: 'Design & Branding'
    },
    {
      icon: Monitor,
      title: 'Website',
      description: 'Complete website development with modern design, functionality, and performance optimization.',
      features: [
        'Multi-page website development',
        'Modern, responsive design',
        'Content management system',
        'Performance optimization',
        'SEO implementation'
      ],
      timeline: '4 Days',
      price: '₹349-499',
      color: 'from-purple-500 to-purple-600',
      category: 'Design & Branding'
    },
    
    // MVP Development & Prototyping Services
    {
      icon: Smartphone,
      title: 'No-Code MVP Development',
      description: 'Rapid MVP development using modern no-code tools like Bubble, Glide, and FlutterFlow.',
      features: [
        'No-code platform selection',
        'Rapid prototyping and development',
        'Database design and integration',
        'User authentication and security',
        'Deployment and hosting setup'
      ],
      timeline: '7-10 Days',
      price: '₹499-699',
      color: 'from-green-500 to-green-600',
      category: 'MVP Development & Prototyping'
    },
    {
      icon: Code,
      title: 'Figma UI/UX Prototype',
      description: 'Interactive clickable design with comprehensive end-to-end user flows and wireframes.',
      features: [
        'User experience design',
        'Interactive wireframes',
        'End-to-end user flows',
        'Design system creation',
        'Prototype testing and iteration'
      ],
      timeline: '7 Days',
      price: '₹549-749',
      color: 'from-green-500 to-green-600',
      category: 'MVP Development & Prototyping'
    },
    
    // Fundraising & Investor Preparation Services
    {
      icon: Presentation,
      title: 'Pitch Deck Creation',
      description: 'Professional 10-12 slide pitch deck with compelling storytelling and investor-focused messaging.',
      features: [
        'Story-driven narrative structure',
        'Investor-focused messaging',
        'Financial highlights and projections',
        'Market opportunity presentation',
        'Team and traction showcase'
      ],
      timeline: '4-5 Days',
      price: '₹249-339',
      color: 'from-orange-500 to-orange-600',
      category: 'Fundraising & Investor Preparation'
    },
    {
      icon: Calculator,
      title: 'Financial Projections',
      description: 'Comprehensive financial modeling including revenue streams, breakeven analysis, and 3-year planning.',
      features: [
        'Revenue stream modeling',
        'Breakeven analysis',
        '3-year financial projections',
        'Cash flow forecasting',
        'Investment requirement analysis'
      ],
      timeline: '2 Days',
      price: '₹149',
      color: 'from-orange-500 to-orange-600',
      category: 'Fundraising & Investor Preparation'
    },
    
    // Mentorship & Incubation Services
    {
      icon: MessageCircle,
      title: '1:1 Strategy Calls',
      description: 'Personalized coaching and feedback sessions to guide your startup journey and decision-making.',
      features: [
        'Personalized strategy coaching',
        'Startup roadmap planning',
        'Problem-solving and decision support',
        'Industry insights and advice',
        'Action plan development'
      ],
      timeline: '30 mins',
      price: '₹79 per call',
      color: 'from-indigo-500 to-indigo-600',
      category: 'Mentorship & Incubation'
    },
    {
      icon: Rocket,
      title: '30-Day Incubation (Beta)',
      description: 'Comprehensive incubation program including build, mentor, GTM strategy, and pitch practice.',
      features: [
        'Intensive mentorship program',
        'Product development support',
        'Go-to-market strategy execution',
        'Pitch deck refinement and practice',
        'Investor introduction and networking'
      ],
      timeline: '30 Days',
      price: 'Based on project',
      color: 'from-indigo-500 to-indigo-600',
      category: 'Mentorship & Incubation'
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            From initial concept to successful launch, we provide comprehensive services to turn your startup idea into reality.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-16">
          {/* Group services by category */}
          {Array.from(new Set(services.map(s => s.category))).map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">{category}</h2>
                <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.filter(service => service.category === category).map((service, index) => (
                  <AnimatedCard key={index} className="overflow-hidden h-full">
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color}`}>
                          <service.icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{service.title}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-2">
                              <Clock size={14} className="text-orange-500" />
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {service.timeline}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-orange-500">{service.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-orange-400">What's Included:</h4>
                        <div className="space-y-1">
                          {service.features.slice(0, 3).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature}
                              </span>
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              +{service.features.length - 3} more features
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 text-sm"
                        onClick={() => openModal(service)}
                      >
                        Get Started
                      </button>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Popup for Service Info */}
        {modalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className={`w-full max-w-lg mx-4 rounded-2xl shadow-2xl border-2 ${isDark ? 'bg-slate-900 border-orange-500' : 'bg-white border-orange-500'} p-8 relative animate-fadeIn`}>
              <button
                className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 text-2xl font-bold focus:outline-none"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedService.color} mb-2`}>
                  <selectedService.icon size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-orange-500 text-center mb-2">{selectedService.title}</h2>
                <p className={`text-center text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{selectedService.description}</p>
                
                {/* Price and Timeline */}
                <div className="w-full flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-orange-500" />
                    <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Timeline: {selectedService.timeline}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-500">{selectedService.price}</span>
                  </div>
                </div>
                
                <div className="w-full mb-4">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">What's Included:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full mt-2">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">Category</h4>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedService.category}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule a Call Modal */}
        {callModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl border-2 ${isDark ? 'bg-slate-900 border-orange-500' : 'bg-white border-orange-500'} p-8 relative animate-fadeIn`}>
              <button
                className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 text-2xl font-bold focus:outline-none"
                onClick={() => setCallModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-4">
                <img
                  src="/images/founder-setu.JPG"
                  alt="E Sai Eshwar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-orange-500 text-center mb-1">E Sai Eshwar</h2>
                <p className="text-center text-lg text-gray-300 mb-1">Founder, Setu Studios</p>
                <a href="mailto:saieshwar@example.com" className="text-orange-400 hover:underline mb-2">saieshwar@example.com</a>
                <p className="text-center text-base text-gray-400 mb-4">Let's connect to discuss your startup idea, answer your questions, or help you get started on your journey!</p>
                <div className="flex gap-8 mt-2">
                  <a href="tel:+1234567890" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300" title="Call">
                    <Phone size={28} />
                  </a>
                  <a href="mailto:saieshwar@example.com" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300" title="Mail">
                    <Mail size={28} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <AnimatedCard className="p-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Let's discuss your project and create a custom plan that fits your needs and timeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                  onClick={() => setCallModalOpen(true)}
                >
                  Schedule a Call
                </button>
                <button
                  className={`px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-105`}
                  onClick={() => {
                    navigate('/packages');
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
                  }}
                >
                  View Packages
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default Services;