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
  Mail
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
    {
      icon: Brain,
      title: 'Strategy & Business Design',
      description: 'Transform your idea into a solid business foundation with AI-powered market research and strategic planning.',
      features: [
        'AI-powered market analysis',
        'Business model design',
        'Competitive landscape research',
        'Go-to-market strategy',
        'Financial projections'
      ],
      timeline: '2-3 weeks',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Palette,
      title: 'Design & Branding',
      description: 'Create a compelling brand identity and user experience that resonates with your target audience.',
      features: [
        'Brand identity design',
        'Logo and visual assets',
        'UI/UX design',
        'Design system creation',
        'Marketing materials'
      ],
      timeline: '3-4 weeks',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Code,
      title: 'MVP Development',
      description: 'Build your minimum viable product with modern technology stack and best development practices.',
      features: [
        'Full-stack development',
        'Mobile-responsive design',
        'Database architecture',
        'API development',
        'Testing and QA'
      ],
      timeline: '4-8 weeks',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Fundraising & Mentorship',
      description: 'Get expert guidance through pitch decks, investor outreach, and funding strategy development.',
      features: [
        'Pitch deck creation',
        'Investor research',
        'Financial modeling',
        'Fundraising strategy',
        'Ongoing mentorship'
      ],
      timeline: '4-6 weeks',
      color: 'from-orange-500 to-orange-600'
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
        <div className="space-y-12">
          {services.map((service, index) => (
            <AnimatedCard key={index} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color}`}>
                      <service.icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={16} className="text-orange-500" />
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {service.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">What's Included:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                    onClick={() => openModal(service)}
                  >
                    Get Started
                  </button>
                </div>

                {/* Visual */}
                <div className={`rounded-xl p-8 flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-gray-100'
                } min-h-[300px]`}>
                  <div className="text-center space-y-4">
                    <div className={`inline-flex p-6 rounded-full bg-gradient-to-r ${service.color}`}>
                      <service.icon size={48} className="text-white" />
                    </div>
                    <h4 className="text-lg font-semibold">{service.title}</h4>
                    <div className="flex items-center justify-center space-x-2">
                      <Target size={16} className="text-orange-500" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Delivery in {service.timeline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
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
                <div className="w-full mb-4">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">What's Included:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full mt-2">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">More Info</h4>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This is some extra information about the {selectedService.title} service. You can add more details here to help users understand what makes this service special and how it can benefit them.</p>
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