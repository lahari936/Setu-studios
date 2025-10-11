# Setu Studios - Bridge to Launch

A comprehensive startup development platform providing end-to-end services from idea analysis to product launch.

## Overview

Setu Studios is a React-based web application that helps startups navigate from idea validation to MVP launch and fundraising. The platform features AI-powered idea analysis, service packages, and order management.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend Services**: 
  - Supabase (Database & Authentication)
  - Google Gemini AI (Startup Idea Analysis)
  - EmailJS (Email Notifications)
- **Icons**: Lucide React

## Recent Changes

### 2025-10-11: New Feature Additions
- ✅ **Mentorship Marketplace**: New page with 10 expert mentor profiles, connect functionality via enquiry modal
- ✅ **Blog & News**: Startup Stories section with curated content + NewsAPI integration for latest startup news
- ✅ **AI Analyzer Enhancements**: Added PDF export (html2pdf.js) and "Execute with Us" button
- ✅ **AI Co-Founder Assistant**: Floating chatbot widget with startup-focused advice and guidance
- ✅ **Homepage Updates**: Added navigation links and feature cards for new sections
- ✅ **Reusable Components**: Created EnquiryModal for consistent user engagement across features

### 2025-10-11: Initial Replit Setup
- ✅ Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- ✅ Fixed Vite to allow all hosts (`allowedHosts: true`) for Replit's proxy environment
- ✅ HMR (Hot Module Replacement) working correctly with WebSocket connectivity
- ✅ Updated Supabase config to use fallback values when env vars are missing (prevents app crashes)
- ✅ Set up deployment configuration for autoscale hosting
- ✅ Production build tested and working
- ✅ All dependencies installed and verified

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIChatbot.tsx        # Floating AI co-founder assistant
│   ├── AnimatedCard.tsx
│   ├── EnquiryModal.tsx     # Reusable enquiry/contact modal
│   ├── Layout.tsx
│   └── Notification.tsx
├── config/             # Configuration files
│   └── supabase.ts     # Supabase client config (with fallbacks)
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
├── data/               # Static data files
│   └── mentors.json    # Mentor profiles for marketplace
├── pages/              # Page components
│   ├── Blog.tsx            # Startup stories & news
│   ├── Cart.tsx
│   ├── Home.tsx
│   ├── IdeaAnalyzer.tsx    # AI analysis with PDF export
│   ├── Mentorship.tsx      # Mentor marketplace
│   ├── Packages.tsx
│   └── Services.tsx
└── services/           # External services
    ├── database.ts
    ├── email.ts
    ├── gemini.ts
    └── orders.ts
```

## Environment Variables

The application requires the following environment variables for full functionality:

### Required for Production
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
VITE_EMAILJS_TEMPLATE_ADMIN=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Admin Email
VITE_ADMIN_EMAIL=admin@setustudios.com
```

### Current Status
- App runs with placeholder values for development
- Database features require proper Supabase configuration
- AI analysis requires Gemini API key
- Email notifications require EmailJS setup

See `.env.example` for a complete template.

## Development

The app is configured to run on port 5000 with Vite's development server:

```bash
npm run dev
```

## Deployment

The app is configured for Replit's autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run preview -- --host 0.0.0.0 --port 5000`
- Deployment type: Autoscale (stateless web app)

## Database Schema

SQL schema files are included:
- `database-schema-supabase-auth.sql` - Authentication tables
- `database-schema.sql` - Main application tables
- `database-schema-orders.sql` - Order management tables

## Key Features

### Core Platform
1. **AI-Powered Idea Analysis**: Uses Google Gemini AI to analyze startup ideas with PDF export
2. **Service Packages**: Pre-defined packages for different startup needs
3. **Order Management**: Complete checkout and order tracking
4. **Email Notifications**: Automated customer and admin notifications
5. **Responsive Design**: Mobile-first UI with dark/light theme support
6. **User Authentication**: Supabase-based auth system

### New Features (October 2025)
7. **Mentorship Marketplace**: Connect with 50+ industry experts across 15+ domains with 200+ success stories
8. **Blog & News**: Curated startup stories and live news integration via NewsAPI
9. **AI Co-Founder Assistant**: 24/7 floating chatbot providing startup advice and strategic guidance
10. **Enhanced AI Analyzer**: PDF report downloads and direct execution consultation

## Environment Variables (Optional)

### NewsAPI (for Blog page)
```env
VITE_NEWS_API_KEY=your_newsapi_key
```
- **Optional**: Blog falls back to curated Startup Stories if not configured
- Get your free API key at: https://newsapi.org

## Notes

- The app gracefully handles missing environment variables in development
- Supabase config uses placeholder values to prevent crashes when not configured
- EmailJS features are optional and will silently fail if not configured
- NewsAPI integration has fallback content for development
- Vite HMR is properly configured for Replit's proxy environment
- AI Chatbot provides scripted responses; can be upgraded to real AI services
- PDF export uses html2pdf.js (already installed)
