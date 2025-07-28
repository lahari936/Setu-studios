import React, { useState } from 'react';
import { 
  User, 
  MessageSquare, 
  Bell,
  CreditCard,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';

const Profile: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'billing'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'TechStart Inc.',
    stage: 'MVP Development',
    phone: '+1 (555) 123-4567',
    timezone: 'PST',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const projects = [
    {
      id: '1',
      name: 'AI Task Manager',
      package: 'MVP Launch Pack',
      status: 'In Progress',
      progress: 75,
      nextMilestone: 'Beta Testing',
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      name: 'E-commerce Platform',
      package: 'Prototype Builder',
      status: 'Completed',
      progress: 100,
      nextMilestone: 'Launched',
      dueDate: '2024-12-01'
    }
  ];

  const billingHistory = [
    {
      id: '1',
      date: '2025-01-15',
      description: 'MVP Launch Pack - Monthly',
      amount: '$4,997',
      status: 'Paid'
    },
    {
      id: '2',
      date: '2024-12-15',
      description: 'Prototype Builder - One-time',
      amount: '$2,497',
      status: 'Paid'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checkbox.checked
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'text-blue-500 bg-blue-500/10';
      case 'Completed':
        return 'text-green-500 bg-green-500/10';
      case 'Paid':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your account, projects, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedCard className="p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{profileData.name}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {profileData.company}
                </p>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                  isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {profileData.stage}
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'profile' | 'projects' | 'billing')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : isDark 
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    <MessageSquare size={16} />
                    <span>Contact Support</span>
                  </button>
                  <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    <Bell size={16} />
                    <span>Notifications</span>
                  </button>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <AnimatedCard className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Startup Stage</label>
                    <select
                      name="stage"
                      value={profileData.stage}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    >
                      <option value="Idea Stage">Idea Stage</option>
                      <option value="MVP Development">MVP Development</option>
                      <option value="Early Traction">Early Traction</option>
                      <option value="Growth Stage">Growth Stage</option>
                      <option value="Scale Stage">Scale Stage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select
                      name="timezone"
                      value={profileData.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? `focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                            }`
                          : `${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} cursor-not-allowed`
                      }`}
                    >
                      <option value="PST">Pacific (PST)</option>
                      <option value="MST">Mountain (MST)</option>
                      <option value="CST">Central (CST)</option>
                      <option value="EST">Eastern (EST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 ${
                        isDark ? 'border-slate-600 hover:bg-slate-700 text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </AnimatedCard>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <AnimatedCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6">My Projects</h2>
                  
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <div key={project.id} className={`p-6 rounded-lg border ${
                        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {project.package}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              Next: {project.nextMilestone}
                            </span>
                          </div>
                          <div>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              Due: {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-4">
                          <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center space-x-1">
                            <ExternalLink size={16} />
                            <span>View Details</span>
                          </button>
                          <button className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center space-x-1">
                            <MessageSquare size={16} />
                            <span>Message Team</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <AnimatedCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Billing & Payments</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                      } flex justify-between items-center`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-8 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-300'} flex items-center justify-center`}>
                            <CreditCard size={16} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Expires 12/27
                            </p>
                          </div>
                        </div>
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                          Update
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                      <div className="space-y-4">
                        {billingHistory.map((bill) => (
                          <div key={bill.id} className={`p-4 rounded-lg border ${
                            isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                          } flex justify-between items-center`}>
                            <div>
                              <p className="font-medium">{bill.description}</p>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {new Date(bill.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{bill.amount}</p>
                              <div className={`text-xs px-2 py-1 rounded ${getStatusColor(bill.status)}`}>
                                {bill.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;