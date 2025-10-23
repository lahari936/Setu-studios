import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Users, Calendar, MapPin, Clock, Star, ExternalLink, ChevronDown, ChevronUp, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import EnquiryModal from '../components/EnquiryModal';
import CalendlyWidget from '../components/CalendlyWidget';
import mentorsData from '../data/mentors.json';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Mentor {
  id: number;
  name: string;
  domain: string;
  expertise: string;
  photo: string;
  experience: string;
  company: string;
  verified?: boolean;
  bio?: string;
  linkedin?: string;
  email?: string;
  calendlyUrl?: string;
  location?: string;
  rating?: number;
  sessionsCompleted?: number;
  specialties?: string[];
}

const Mentorship: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [expandedMentor, setExpandedMentor] = useState<number | null>(null);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [calendlyMentor, setCalendlyMentor] = useState<Mentor | null>(null);
  const { showNotification } = useNotification();
  const [mentorsRef, mentorsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [showUnverified, setShowUnverified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  // Form state for mentor submission
  const [form, setForm] = useState({ name: '', designation: '', experience: '', sectors: '', bio: '', linkedin: '' });

  const handleConnect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setEnquiryModalOpen(true);
  };

  const handleScheduleMeeting = (mentor: Mentor) => {
    if (mentor.calendlyUrl) {
      setCalendlyMentor(mentor);
      setCalendlyOpen(true);
    } else {
      showNotification('Meeting scheduling not available for this mentor yet', 'warning');
    }
  };

  const toggleExpanded = (mentorId: number) => {
    setExpandedMentor(expandedMentor === mentorId ? null : mentorId);
  };

  useEffect(() => {
    // Load mentors from localStorage first, fall back to bundled data
    const stored = localStorage.getItem('mentors_local');
    if (stored) {
      try {
        setMentors(JSON.parse(stored));
      } catch {
        setMentors(mentorsData as Mentor[]);
      }
    } else {
      setMentors(mentorsData as Mentor[]);
    }
  }, []);

  // Filter mentors based on search and domain
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === '' || mentor.domain === selectedDomain;
    const matchesVerification = showUnverified || mentor.verified;
    
    return matchesSearch && matchesDomain && matchesVerification;
  });

  // Get unique domains for filter
  const domains = Array.from(new Set(mentors.map(m => m.domain)));

  const persistMentors = (list: Mentor[]) => {
    setMentors(list);
    try {
      localStorage.setItem('mentors_local', JSON.stringify(list));
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(0, ...mentors.map(m => m.id)) + 1;
    const newMentor: Mentor = {
      id: nextId,
      name: form.name,
      domain: form.designation,
      expertise: form.sectors,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=f97316&color=fff`,
      experience: form.experience,
      company: '',
      verified: false
    };

    persistMentors([newMentor, ...mentors]);
    setForm({ name: '', designation: '', experience: '', sectors: '', bio: '', linkedin: '' });
    showNotification('You will be appeared on screen after approving', 'success');
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <AnimatedCard>
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                  <GraduationCap size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Mentorship Marketplace
              </h1>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Connect with industry experts who can guide you through your startup journey. 
                Get personalized advice, strategic insights, and actionable feedback.
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <AnimatedCard className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Users size={40} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-orange-500 mb-2">4</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Expert Mentors</p>
          </AnimatedCard>
          <AnimatedCard className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Briefcase size={40} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-orange-500 mb-2">4</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Industry Domains</p>
          </AnimatedCard>
          <AnimatedCard className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Award size={40} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-orange-500 mb-2">200+</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Success Stories</p>
          </AnimatedCard>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Mentors</h2>
          
          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search mentors by name, domain, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isDark 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:border-orange-500 focus:outline-none transition-colors`}
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isDark 
                      ? 'bg-slate-800 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:border-orange-500 focus:outline-none transition-colors`}
                >
                  <option value="">All Domains</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={showUnverified} 
                  onChange={() => setShowUnverified(v => !v)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Show Unverified Mentors</span>
            </label>
            </div>
          </div>

          {/* Mentors Grid - LinkedIn Style */}
          <div ref={mentorsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={mentorsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
                className={`overflow-hidden transition-all duration-300 cursor-pointer ${
                  expandedMentor === mentor.id ? 'lg:col-span-2' : ''
                }`}
                onClick={() => mentor.linkedin && window.open(mentor.linkedin, '_blank', 'noopener,noreferrer')}
              >
              <AnimatedCard className="h-full group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
                {/* LinkedIn-style Card Header */}
                <div className="relative">
                  {/* Background Banner */}
                  <div className="h-20 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  
                  {/* Profile Picture */}
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={mentor.photo} 
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${mentor.name}&size=128&background=f97316&color=fff`;
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleExpanded(mentor.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {expandedMentor === mentor.id ? (
                      <ChevronUp size={20} className="text-white" />
                    ) : (
                      <ChevronDown size={20} className="text-white" />
                    )}
                  </button>
                </div>

                {/* Card Content */}
                <div className="pt-10 px-6 pb-6">
                  {/* Basic Info */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{mentor.name}</h3>
                        <p className="text-orange-500 font-semibold">{mentor.domain}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {mentor.company}
                        </p>
                      </div>
                      {mentor.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Award size={16} />
                          <span className="text-xs font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Rating and Sessions */}
                    <div className="flex items-center gap-4 text-sm mb-3">
                      {mentor.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {mentor.rating} ({mentor.sessionsCompleted || 0} sessions)
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-orange-500" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {mentor.location || 'Remote'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedMentor === mentor.id && (
                    <div className="space-y-4 border-t pt-4">
                      {/* Bio */}
                      {mentor.bio && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About</h4>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {mentor.bio}
                          </p>
                        </div>
                      )}

                      {/* Specialties */}
                      {mentor.specialties && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentor.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience Details */}
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={16} className="text-orange-500" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {mentor.experience} Experience
                        </span>
                      </div>

                      {/* Contact Links */}
                      <div className="flex items-center gap-4">
                        {mentor.linkedin && (
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Linkedin size={16} />
                            LinkedIn
                          </a>
                        )}
                        {mentor.email && (
                          <a
                            href={`mailto:${mentor.email}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm"
                          >
                            <Mail size={16} />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleScheduleMeeting(mentor)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                      <Calendar size={16} />
                      Schedule Meeting
                    </button>
                    <button
                      onClick={() => handleConnect(mentor)}
                      className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                    >
                      <MessageCircle size={16} />
                      Connect
                    </button>
                    {mentor.linkedin && (
                      <button
                        onClick={() => window.open(mentor.linkedin, '_blank', 'noopener,noreferrer')}
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        title="View LinkedIn Profile"
                      >
                        <Linkedin size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </AnimatedCard>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No mentors found</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search criteria or showing unverified mentors.
              </p>
            </div>
          )}
        </div>

        {/* Create Mentor Profile Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Create Your Mentor Profile</h2>
          <AnimatedCard className="max-w-3xl mx-auto p-6">
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
                <input required placeholder="Designation / Domain" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Experience (e.g., 10+ years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
                <input placeholder="Focus Sectors (comma separated)" value={form.sectors} onChange={e => setForm({...form, sectors: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
              </div>
              <textarea placeholder="Short Description / Bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
              <input placeholder="LinkedIn URL" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 text-black" />
              <div className="text-center">
                <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold">Submit Profile</button>
              </div>
            </form>
          </AnimatedCard>
        </div>

        {/* CTA Section */}
        <AnimatedCard className="text-center p-12 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Domain?</h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            We're constantly adding new mentors across various industries. 
            Reach out to us for personalized mentor matching!
          </p>
          <button
            onClick={() => setEnquiryModalOpen(true)}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
          >
            Request Custom Mentor
          </button>
        </AnimatedCard>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => {
          setEnquiryModalOpen(false);
          setSelectedMentor(null);
        }}
        title={selectedMentor ? `Connect with ${selectedMentor.name}` : "Request Mentorship"}
        message={
          selectedMentor 
            ? `Interested in connecting with ${selectedMentor.name} for ${selectedMentor.domain}? Let's schedule a call to discuss your needs!`
            : "Let's connect to find the perfect mentor for your startup journey!"
        }
      />

      {/* Calendly Widget */}
      {calendlyMentor && (
        <CalendlyWidget
          mentorName={calendlyMentor.name}
          calendlyUrl={calendlyMentor.calendlyUrl || ''}
          isOpen={calendlyOpen}
          onClose={() => {
            setCalendlyOpen(false);
            setCalendlyMentor(null);
          }}
        />
      )}
    </div>
  );
};

export default Mentorship;
