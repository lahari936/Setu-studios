# Authentication Setup Guide

This guide will help you set up the authentication system for Setu Studios with LinkedIn-quality user experience.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LinkedIn OAuth Configuration
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# Firebase Configuration (if using Firebase Auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Calendly Configuration (optional)
VITE_CALENDLY_DEFAULT_URL=https://calendly.com/your-username

# App Configuration
VITE_APP_NAME=Setu Studios
VITE_APP_VERSION=1.0.0
```

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy the Project URL and anon key

2. **Configure Authentication Providers**
   - In Supabase Dashboard, go to Authentication > Providers
   - Enable Google OAuth:
     - Add your Google OAuth credentials
     - Set redirect URL to: `https://your-domain.com/auth/callback`
   - Enable LinkedIn OAuth (if supported):
     - Add LinkedIn OAuth credentials
     - Set redirect URL to: `https://your-domain.com/auth/callback`

3. **Database Schema**
   - The authentication system will automatically create user profiles
   - Ensure the `users` table exists with the required fields

## LinkedIn OAuth Setup

1. **Create LinkedIn App**
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - Create a new app
   - Add the following redirect URLs:
     - `http://localhost:5173/linkedin-callback` (for development)
     - `https://your-domain.com/linkedin-callback` (for production)

2. **Configure Scopes**
   - Request the following scopes:
     - `openid`
     - `profile`
     - `email`

## Google OAuth Setup

1. **Create Google OAuth App**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

## Features Implemented

### ✅ Authentication Features
- **Email/Password Authentication**: Secure sign-up and sign-in
- **Google OAuth**: One-click Google sign-in
- **LinkedIn OAuth**: Professional LinkedIn integration
- **Persistent Sessions**: Automatic session refresh and management
- **Secure Logout**: Complete session cleanup

### ✅ User Experience Features
- **Profile Dropdown**: LinkedIn-style profile menu with:
  - User avatar with fallback initials
  - Quick access to profile, settings, bookings
  - Smooth animations and transitions
- **Smooth Navigation**: Preloading and optimized page transitions
- **Loading States**: Professional loading indicators
- **Error Handling**: Comprehensive error management

### ✅ Calendly Integration
- **Embedded Widget**: Seamless calendar integration
- **Popup Mode**: Alternative popup experience
- **Performance Optimized**: Lazy loading and layout shift prevention
- **Responsive Design**: Works on all device sizes

### ✅ Session Management
- **Automatic Refresh**: Tokens refresh before expiry
- **Persistent Storage**: Sessions survive browser restarts
- **Security**: Secure token storage and cleanup
- **Monitoring**: Real-time session validity checks

## Usage Examples

### Using the Profile Dropdown
```tsx
import ProfileDropdown from './components/ProfileDropdown';

<ProfileDropdown 
  user={user} 
  userProfile={userProfile} 
  isDark={isDark} 
/>
```

### Using Smooth Navigation
```tsx
import { useSmoothNavigation } from './hooks/useSmoothNavigation';

const { smoothNavigate, isNavigating } = useSmoothNavigation();

// Navigate with preloading
smoothNavigate('/mentorship');
```

### Using Calendly Widget
```tsx
import CalendlyWidget from './components/CalendlyWidget';

<CalendlyWidget
  mentorName="John Doe"
  calendlyUrl="https://calendly.com/johndoe"
  isOpen={isCalendlyOpen}
  onClose={() => setIsCalendlyOpen(false)}
  embedded={true} // or false for popup mode
/>
```

## Performance Optimizations

1. **Lazy Loading**: Calendly script loads only when needed
2. **Session Monitoring**: Efficient background session checks
3. **Preloading**: Critical data preloaded for smooth navigation
4. **Memory Management**: Proper cleanup of event listeners and intervals

## Security Features

1. **PKCE Flow**: Secure OAuth implementation
2. **Token Refresh**: Automatic token renewal
3. **Secure Storage**: Proper token storage and cleanup
4. **Error Boundaries**: Graceful error handling

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Troubleshooting

### Common Issues

1. **LinkedIn OAuth Not Working**
   - Check redirect URLs in LinkedIn app settings
   - Ensure correct client ID in environment variables
   - Verify LinkedIn app is approved for production

2. **Session Not Persisting**
   - Check localStorage is enabled
   - Verify Supabase configuration
   - Check browser console for errors

3. **Calendly Not Loading**
   - Check network connectivity
   - Verify Calendly URL is correct
   - Check for popup blockers

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG_AUTH=true
```

This will log detailed authentication flow information to the console.
