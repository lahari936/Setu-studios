import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Star, 
  ArrowRight,
  Zap,
  Rocket,
  Crown,
  Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';

const Packages: React.FC = () => {
  const { isDark } = useTheme();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<null | typeof packages[0]>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultForm, setConsultForm] = useState({
    name: '',
    email: '',
    idea: '',
    domain: '',
    description: ''
  });
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalOpen]);

  const openModal = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPackage(null);
  };

  const handleConsultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConsultForm({ ...consultForm, [e.target.name]: e.target.value });
  };
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultModalOpen(false);
      setConsultSubmitted(false);
      setConsultForm({ name: '', email: '', idea: '', domain: '', description: '' });
    }, 2000);
  };

  const packages = [
    {
      id: 'ignite',
      name: 'Idea Ignite',
      icon: Zap,
      description: 'Perfect for validating your startup idea with AI-powered insights.',
      popular: false,
      monthlyPrice: 497,
      yearlyPrice: 4970,
      features: [
        'AI Idea Analysis Report',
        'Market Research & Validation',
        'Competitive Landscape Analysis',
        'Basic Business Model Canvas',
        '1 Strategy Call (60 min)',
        'Email Support'
      ],
      deliverables: [
        '20-page comprehensive report',
        'Market size analysis',
        'Risk assessment',
        'Next steps roadmap'
      ],
      timeline: '3-5 business days',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'prototype',
      name: 'Prototype Builder',
      icon: Rocket,
      description: 'Turn your validated idea into a working prototype.',
      popular: true,
      monthlyPrice: 2497,
      yearlyPrice: 24970,
      features: [
        'Everything in Idea Ignite',
        'Interactive Prototype Design',
        'User Journey Mapping',
        'Basic Brand Identity',
        'Wireframes & Mockups',
        '3 Strategy Calls (60 min each)',
        'Priority Support'
      ],
      deliverables: [
        'Clickable prototype',
        'Design system basics',
        'User flow documentation',
        'Technical specification'
      ],
      timeline: '2-3 weeks',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'mvp',
      name: 'MVP Launch Pack',
      icon: Crown,
      description: 'Complete MVP development ready for market launch.',
      popular: false,
      monthlyPrice: 4997,
      yearlyPrice: 49970,
      features: [
        'Everything in Prototype Builder',
        'Full MVP Development',
        'Database Setup & Integration',
        'Complete Brand Identity',
        'Landing Page & Marketing Site',
        'Weekly Strategy Calls',
        'Slack/Discord Support'
      ],
      deliverables: [
        'Fully functional MVP',
        'Production deployment',
        'User authentication system',
        'Admin dashboard'
      ],
      timeline: '4-6 weeks',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'investor',
      name: 'Investor Ready Pack',
      icon: Shield,
      description: 'Complete package to prepare for fundraising and scaling.',
      popular: false,
      monthlyPrice: 9997,
      yearlyPrice: 99970,
      features: [
        'Everything in MVP Launch Pack',
        'Pitch Deck Creation',
        'Financial Modeling',
        'Investor Research & Outreach',
        'Due Diligence Preparation',
        'Unlimited Strategy Calls',
        'Dedicated Success Manager'
      ],
      deliverables: [
        'Professional pitch deck',
        '3-year financial model',
        'Investor target list',
        'Legal document templates'
      ],
      timeline: '6-8 weeks',
      color: 'from-green-500 to-green-600'
    }
  ];

  const getPrice = (pkg: typeof packages[0]) => {
    const price = billingCycle === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;
    return billingCycle === 'yearly' ? Math.floor(price / 12) : price;
  };

  const getSavings = (pkg: typeof packages[0]) => {
    if (billingCycle === 'yearly') {
      const monthlyCost = pkg.monthlyPrice * 12;
      const yearlyCost = pkg.yearlyPrice;
      const savings = ((monthlyCost - yearlyCost) / monthlyCost * 100);
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Package</h1>
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            From idea validation to investor-ready startups, we have the right package for your journey.
          </p>

          {/* Billing Toggle */}
          <div className={`inline-flex p-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-orange-500 text-white'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="relative">
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star size={14} className="mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <AnimatedCard 
                className={`h-full ${pkg.popular ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}
                glowOnHover={pkg.popular}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${pkg.color} mb-4`}>
                    <pkg.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">${getPrice(pkg).toLocaleString()}</span>
                    <span className={`ml-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{billingCycle === 'yearly' ? '/mo' : '/project'}</span>
                  </div>
                  {billingCycle === 'yearly' && getSavings(pkg) > 0 && (
                    <div className="text-sm text-green-500 mt-1">
                      Save {getSavings(pkg)}% annually
                    </div>
                  )}
                  <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Delivery: {pkg.timeline}</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold mb-3">Features:</h4>
                    <div className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Deliverables:</h4>
                    <div className="space-y-2">
                      {pkg.deliverables.map((deliverable, deliverableIndex) => (
                        <div key={deliverableIndex} className="flex items-start space-x-2">
                          <ArrowRight size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    pkg.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/25'
                      : isDark 
                        ? 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                        : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                  }`}
                  onClick={() => openModal(pkg)}
                >
                  {'Choose Plan'}
                </button>
              </AnimatedCard>
            </div>
          ))}
        </div>

        {/* Modal Popup for Package Plan */}
        {modalOpen && selectedPackage && (
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
                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedPackage.color} mb-2`}>
                  <selectedPackage.icon size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-orange-500 text-center mb-2">{selectedPackage.name}</h2>
                <p className={`text-center text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{selectedPackage.description}</p>
                <div className="w-full mb-4">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPackage.features.map((feature, idx) => (
                      <li key={idx} className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full mb-4">
                  <h4 className="font-semibold text-lg mb-2 text-orange-400">Deliverables:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPackage.deliverables.map((deliverable, idx) => (
                      <li key={idx} className={isDark ? 'text-gray-300' : 'text-gray-700'}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
                  <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105">Buy Now</button>
                  <button className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-105">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
          
          <AnimatedCard className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <th className="text-left py-4 px-6 font-semibold">Features</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="text-center py-4 px-6 font-semibold">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'AI Idea Analysis',
                  'Market Research',
                  'Prototype Design',
                  'MVP Development',
                  'Brand Identity',
                  'Pitch Deck',
                  'Strategy Calls',
                  'Priority Support'
                ].map((feature, index) => (
                  <tr key={index} className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <td className="py-4 px-6">{feature}</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="text-center py-4 px-6">
                        <CheckCircle 
                          size={20} 
                          className={
                            (index === 0 && ['ignite', 'prototype', 'mvp', 'investor'].includes(pkg.id)) ||
                            (index === 1 && ['ignite', 'prototype', 'mvp', 'investor'].includes(pkg.id)) ||
                            (index === 2 && ['prototype', 'mvp', 'investor'].includes(pkg.id)) ||
                            (index === 3 && ['mvp', 'investor'].includes(pkg.id)) ||
                            (index === 4 && ['prototype', 'mvp', 'investor'].includes(pkg.id)) ||
                            (index === 5 && ['investor'].includes(pkg.id)) ||
                            (index === 6) ||
                            (index === 7 && ['prototype', 'mvp', 'investor'].includes(pkg.id))
                            ? 'text-green-500' 
                            : 'text-gray-300'
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedCard>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <AnimatedCard className="p-12">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Every startup is unique. Let's create a package that fits your specific needs and budget.
            </p>
            <button
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
              onClick={() => setConsultModalOpen(true)}
            >
              Schedule a Custom Consultation
            </button>
          </AnimatedCard>
        </div>

        {/* Custom Consultation Modal */}
        {consultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className={`w-full max-w-lg mx-4 rounded-2xl shadow-2xl border-2 ${isDark ? 'bg-slate-900 border-orange-500' : 'bg-white border-orange-500'} p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]`}>
              <button
                className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 text-2xl font-bold focus:outline-none"
                onClick={() => setConsultModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              {!consultSubmitted ? (
                <form onSubmit={handleConsultSubmit} className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-orange-500 text-center mb-2">Custom Consultation</h2>
                  <input
                    type="text"
                    name="name"
                    value={consultForm.name}
                    onChange={handleConsultChange}
                    placeholder="Your Name"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={consultForm.email}
                    onChange={handleConsultChange}
                    placeholder="Your Email"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <input
                    type="text"
                    name="idea"
                    value={consultForm.idea}
                    onChange={handleConsultChange}
                    placeholder="Your Idea"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <input
                    type="text"
                    name="domain"
                    value={consultForm.domain}
                    onChange={handleConsultChange}
                    placeholder="Domain (e.g. SaaS, FinTech, HealthTech)"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <textarea
                    name="description"
                    value={consultForm.description}
                    onChange={handleConsultChange}
                    placeholder="Short Description"
                    required
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                      <CheckCircle size={60} className="text-green-500" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-500">Submitted</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;