import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import EnquiryModal from '../components/EnquiryModal';
import mentorsData from '../data/mentors.json';
import { useNotification } from '../contexts/NotificationContext';

interface Mentor {
  id: number;
  name: string;
  domain: string;
  expertise: string;
  photo: string;
  experience: string;
  company: string;
  verified?: boolean;
}

const Mentorship: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [showUnverified, setShowUnverified] = useState(false);

  // Form state for mentor submission
  const [form, setForm] = useState({ name: '', designation: '', experience: '', sectors: '', bio: '', linkedin: '' });

  const handleConnect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setEnquiryModalOpen(true);
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
            <h3 className="text-3xl font-bold text-orange-500 mb-2">50+</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Expert Mentors</p>
          </AnimatedCard>
          <AnimatedCard className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Briefcase size={40} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-orange-500 mb-2">15+</h3>
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

        {/* Mentors Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Mentors</h2>
          <div className="flex items-center justify-center mb-6 gap-4">
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={showUnverified} onChange={() => setShowUnverified(v => !v)} />
              Show Unverified
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.filter(m => showUnverified ? true : m.verified).map((mentor) => (
              <AnimatedCard key={mentor.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-orange-500">
                      <img 
                        src={mentor.photo} 
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${mentor.name}&size=128&background=f97316&color=fff`;
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-orange-500">{mentor.name}</h3>
                    {!mentor.verified && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full mb-2">Unverified</span>
                    )}
                    <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {mentor.domain}
                    </p>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {mentor.expertise}
                    </p>
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <Briefcase size={16} className="text-orange-500" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{mentor.company}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Award size={16} className="text-orange-500" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{mentor.experience} Experience</span>
                    </div>
                    <button
                      onClick={() => handleConnect(mentor)}
                      className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
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
    </div>
  );
};

export default Mentorship;
