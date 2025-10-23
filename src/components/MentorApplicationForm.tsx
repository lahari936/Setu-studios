import React, { useState } from 'react';
import { X, Upload, Award, Briefcase, GraduationCap, MapPin, Mail, Linkedin, Calendar } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/useAuth';

interface MentorApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted: () => void;
}

interface MentorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  experience: string;
  domain: string;
  expertise: string[];
  bio: string;
  location: string;
  linkedinUrl: string;
  calendlyUrl: string;
  availability: string;
  hourlyRate: string;
  languages: string[];
  certifications: string[];
  portfolioUrl: string;
  resume: File | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  verified: boolean;
}

const MentorApplicationForm: React.FC<MentorApplicationFormProps> = ({
  isOpen,
  onClose,
  onApplicationSubmitted
}) => {
  const { showNotification } = useNotification();
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: user?.email || '',
    phone: '',
    company: userProfile?.company || '',
    position: '',
    experience: '',
    domain: '',
    expertise: '',
    bio: '',
    location: '',
    linkedinUrl: '',
    calendlyUrl: '',
    availability: 'flexible',
    hourlyRate: '',
    languages: '',
    certifications: '',
    portfolioUrl: '',
    resume: null as File | null
  });

  const domains = [
    'Technology & Engineering',
    'Business Strategy & Operations',
    'Product & Innovation',
    'Marketing & Sales',
    'Finance & Investment',
    'Legal & Compliance',
    'Healthcare & Life Sciences',
    'Education & Training',
    'Real Estate',
    'E-commerce & Retail',
    'Sustainability & Environment',
    'Entertainment & Media'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      showNotification('Please sign in to apply as a mentor', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const application: MentorApplication = {
        id: `mentor_app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        experience: formData.experience,
        domain: formData.domain,
        expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
        bio: formData.bio,
        location: formData.location,
        linkedinUrl: formData.linkedinUrl,
        calendlyUrl: formData.calendlyUrl,
        availability: formData.availability,
        hourlyRate: formData.hourlyRate,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0),
        portfolioUrl: formData.portfolioUrl,
        resume: formData.resume,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        verified: false
      };

      // Save application to localStorage (in a real app, this would go to a database)
      const existingApplications = JSON.parse(localStorage.getItem('mentor_applications') || '[]');
      existingApplications.push(application);
      localStorage.setItem('mentor_applications', JSON.stringify(existingApplications));

      showNotification('Mentor application submitted successfully! We will review it and get back to you soon.', 'success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        experience: '',
        domain: '',
        expertise: '',
        bio: '',
        location: '',
        linkedinUrl: '',
        calendlyUrl: '',
        availability: 'flexible',
        hourlyRate: '',
        languages: '',
        certifications: '',
        portfolioUrl: '',
        resume: null
      });

      setCurrentStep(1);
      onApplicationSubmitted();
      onClose();

    } catch (error) {
      console.error('Error submitting mentor application:', error);
      showNotification('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Apply as a Mentor
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of {totalSteps} • Share your expertise with the startup community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Country"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Tell us about yourself, your background, and why you want to become a mentor..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Background */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Background</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position/Title *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                    <option value="15+ years">15+ years</option>
                    <option value="20+ years">20+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Domain *
                  </label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select your domain</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Areas of Expertise *
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Product Strategy, Fundraising, Team Building, Marketing"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Availability & Pricing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability & Pricing</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability *
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="weekends">Weekends only</option>
                    <option value="evenings">Evenings only</option>
                    <option value="specific">Specific hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Languages
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="e.g., English, Spanish, French"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certifications & Awards
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="e.g., PMP, MBA, Industry Awards"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Links & Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links & Documents</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile URL *
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calendly URL
                  </label>
                  <input
                    type="url"
                    name="calendlyUrl"
                    value={formData.calendlyUrl}
                    onChange={handleInputChange}
                    placeholder="https://calendly.com/yourusername"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio/Website URL
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume/CV (PDF)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Resume
                    </label>
                    {formData.resume && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.resume.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorApplicationForm;
