import React, { useState, useRef, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User as AppUser } from '../services/database';
import { ChevronDown, User, Settings, LogOut, Calendar, Package, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';

interface ProfileDropdownProps {
  user: FirebaseUser;
  userProfile: AppUser | null;
  isDark: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, userProfile, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDisplayName = () => {
    if (userProfile?.name) return userProfile.name;
    if (user.displayName) return user.displayName;
    return user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarUrl = () => {
    return user.photoURL || userProfile?.avatar_url;
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      href: '/profile',
      description: 'View and edit your profile'
    },
    {
      icon: Calendar,
      label: 'My Bookings',
      href: '/bookings',
      description: 'Manage your scheduled sessions'
    },
    {
      icon: Package,
      label: 'My Orders',
      href: '/orders',
      description: 'Track your service orders'
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      description: 'Manage your notifications'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      description: 'Account and privacy settings'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-500/10 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            {getAvatarUrl() ? (
              <img 
                src={getAvatarUrl()} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-orange-600 dark:text-orange-400 font-semibold text-sm">${getInitials()}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                {getInitials()}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
        </div>

        {/* Name */}
        <div className="hidden md:block text-left">
          <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-orange-500 transition-colors`}>
            {getDisplayName()}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {user.email}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-gray-400' : 'text-gray-500'}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                {getAvatarUrl() ? (
                  <img 
                    src={getAvatarUrl()} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-orange-600 dark:text-orange-400 font-semibold text-lg">${getInitials()}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">
                  {getDisplayName()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
                {userProfile?.company && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userProfile.company}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900 transition-colors">
                  <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-slate-700"></div>

          {/* Footer Actions */}
          <div className="py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Sign Out</div>
                <div className="text-xs text-red-500 dark:text-red-400">
                  Sign out of your account
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
