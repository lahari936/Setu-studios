import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import EnquiryModal from '../components/EnquiryModal';
import MeetingScheduler from '../components/MeetingScheduler';
import MentorApplicationForm from '../components/MentorApplicationForm';
import MentorProfileCard from '../components/MentorProfileCard';
import UserTypeSelector from '../components/UserTypeSelector';
import mentorsData from '../data/mentors.json';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getLinkedInProfile } from '../services/linkedinService';
import { UserType } from '../components/UserTypeSelector';

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
  const [meetingSchedulerOpen, setMeetingSchedulerOpen] = useState(false);
  const [selectedMentorForMeeting, setSelectedMentorForMeeting] = useState<Mentor | null>(null);
  const [mentorApplicationOpen, setMentorApplicationOpen] = useState(false);
  const [userTypeSelectorOpen, setUserTypeSelectorOpen] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const { showNotification } = useNotification();
  const [mentorsRef, mentorsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [showUnverified, setShowUnverified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mentorsPerPage] = useState(8); // Show 8 mentors per page (2 rows of 4)

  // Form state for mentor submission
  const [form, setForm] = useState({ name: '', designation: '', experience: '', sectors: '', bio: '', linkedin: '' });

  const handleConnect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setEnquiryModalOpen(true);
  };

  const handleUserTypeSelected = (selectedUserType: UserType) => {
    setUserType(selectedUserType);
    setUserTypeSelectorOpen(false);
    showNotification(`Welcome ${selectedUserType}! Your profile has been customized.`, 'success');
  };

  const handleScheduleMeeting = (mentor: Mentor) => {
    setSelectedMentorForMeeting(mentor);
    setMeetingSchedulerOpen(true);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const startIndex = (currentPage - 1) * mentorsPerPage;
  const endIndex = startIndex + mentorsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDomain, showUnverified]);

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
    <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="container mx-auto max-w-7xl">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <AnimatedCard variant="modern" padding="lg">
            <div className="py-16">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl animate-mentor-guidance">
                  <GraduationCap size={56} className="text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-entrepreneur animate-startup-rise">
                Mentorship Marketplace
              </h1>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Connect with industry experts who can guide you through your startup journey. 
                Get personalized advice, strategic insights, and actionable feedback from proven leaders.
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* Enhanced Stats Section */}
        <div className="modern-grid-3 mb-16">
          <AnimatedCard variant="modern" className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                <Users size={48} className="text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold gradient-text mb-3">4</h3>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Expert Mentors</p>
          </AnimatedCard>
          <AnimatedCard variant="modern" className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Briefcase size={48} className="text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold gradient-text-purple mb-3">4</h3>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Industry Domains</p>
          </AnimatedCard>
          <AnimatedCard variant="modern" className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Award size={48} className="text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold gradient-text-blue mb-3">200+</h3>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success Stories</p>
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

          {/* Mentors Grid - 4 cards per row with navigation */}
          <div className="max-w-7xl mx-auto">
            <div ref={mentorsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentMentors.map((mentor, index) => {
                const linkedinProfile = getLinkedInProfile(mentor.name);
                return (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={mentorsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MentorProfileCard
                      mentor={mentor}
                      linkedinProfile={linkedinProfile}
                      userType={userType}
                      onConnect={handleConnect}
                      onScheduleMeeting={handleScheduleMeeting}
                    />
                  </motion.div>
                );
              })}
                </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center mt-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMentors.length)} of {filteredMentors.length} mentors
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AnimatedCard className="text-center p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <h2 className="text-2xl font-bold mb-4">Don't See Your Domain?</h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We're constantly adding new mentors across various industries. 
              Reach out to us for personalized mentor matching!
            </p>
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              Request Custom Mentor
            </button>
          </AnimatedCard>

          <AnimatedCard className="text-center p-8 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
            <h2 className="text-2xl font-bold mb-4">Want to Become a Mentor?</h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Share your expertise and help other entrepreneurs succeed. 
              Join our network of verified mentors!
            </p>
            <button
              onClick={() => setMentorApplicationOpen(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              Apply as Mentor
            </button>
          </AnimatedCard>
        </div>

        {/* User Type Selection Button */}
        {!userType && (
          <div className="text-center mb-12">
            <AnimatedCard className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
              <h2 className="text-2xl font-bold mb-4">Get Personalized Experience</h2>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Tell us about yourself to get customized mentor recommendations and features!
              </p>
              <button
                onClick={() => setUserTypeSelectorOpen(true)}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
              >
                Tell Us About Yourself
              </button>
            </AnimatedCard>
          </div>
        )}
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

      {/* Meeting Scheduler */}
      {selectedMentorForMeeting && (
        <MeetingScheduler
          mentor={selectedMentorForMeeting}
          isOpen={meetingSchedulerOpen}
          onClose={() => {
            setMeetingSchedulerOpen(false);
            setSelectedMentorForMeeting(null);
          }}
        />
      )}

      {/* Mentor Application Form */}
      <MentorApplicationForm
        isOpen={mentorApplicationOpen}
        onClose={() => setMentorApplicationOpen(false)}
        onApplicationSubmitted={() => {
          setMentorApplicationOpen(false);
          showNotification('Mentor application submitted! We will review it soon.', 'success');
        }}
      />

      {/* User Type Selector */}
      <UserTypeSelector
        isOpen={userTypeSelectorOpen}
        onClose={() => setUserTypeSelectorOpen(false)}
        onUserTypeSelected={handleUserTypeSelected}
      />
    </div>
  );
};

export default Mentorship;
