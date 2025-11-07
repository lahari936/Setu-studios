import React, { useState } from 'react';
import { X, User, Mail, Briefcase, MapPin, Linkedin, Award, FileText, Upload, Loader2 } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface MentorApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted: () => void;
}

const MentorApplicationForm: React.FC<MentorApplicationFormProps> = ({
  isOpen,
  onClose,
  onApplicationSubmitted
}) => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    
    // Professional Information
    company: '',
    position: '',
    experience: '',
    domain: '',
    expertise: '',
    bio: '',
    languages: '',
    certifications: '',
    portfolioUrl: '',
    calendlyUrl: '',
    
    // Additional Information
    availability: 'flexible',
    hourlyRate: '',
    
    // Files
    resume: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'resume' && value) {
          submitData.append(key, value as string);
        }
      });

      // Add resume file if uploaded
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Submit to backend API
      const response = await fetch('/api/mentors', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        showNotification('Mentor application submitted successfully! You will receive an email confirmation shortly.', 'success');
        onApplicationSubmitted();
        handleClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting mentor application:', error);
      showNotification('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '', email: '', phone: '', location: '', linkedinUrl: '',
      company: '', position: '', experience: '', domain: '', expertise: '',
      bio: '', languages: '', certifications: '', portfolioUrl: '', calendlyUrl: '',
      availability: 'flexible', hourlyRate: '', resume: null
    });
    setCurrentStep(1);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.location;
      case 2:
        return formData.company && formData.position && formData.experience && formData.domain;
      case 3:
        return formData.bio && formData.expertise;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Mentor Application
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of 3
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-orange-500' : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Personal Info</span>
            <span>Professional Info</span>
            <span>Additional Info</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h4>
              
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
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
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Professional Information
              </h4>
              
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain/Industry *
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Finance, Healthcare"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expertise Areas
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  placeholder="e.g., Product Management, Marketing, Strategy"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certifications
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="e.g., PMP, AWS Certified, Google Analytics"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio/About You *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about yourself, your background, and what makes you a great mentor..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio/Website URL
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calendly URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="calendlyUrl"
                    value={formData.calendlyUrl}
                    onChange={handleInputChange}
                    placeholder="https://calendly.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="evenings">Evenings Only</option>
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume/CV (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {formData.resume ? formData.resume.name : 'Click to upload resume'}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PDF, DOC, DOCX files only (max 5MB)
                  </p>
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
              className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid(currentStep) || isLoading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorApplicationForm;