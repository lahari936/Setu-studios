# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Gemini AI Configuration  
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
VITE_EMAILJS_TEMPLATE_ADMIN=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# App Configuration
VITE_APP_NAME=Setu Studios
VITE_APP_URL=https://your-domain.com
```

## How to Get API Keys

### 1. Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key

### 2. Gemini AI
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy the API key

### 3. EmailJS
1. Go to [emailjs.com](https://www.emailjs.com)
2. Create an account and service
3. Create email templates for customer and admin notifications
4. Copy the Service ID, Template IDs, and Public Key

## Security Notes

- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive data
- Ensure all API keys have proper permissions and restrictions

## Current Fallback Values

The application has fallback values for development, but you should replace them with your own keys for production:

- **Supabase**: Uses hardcoded values as fallback
- **Gemini**: Uses a hardcoded API key as fallback
- **EmailJS**: Uses hardcoded values as fallback

## Production Deployment

1. Set up environment variables in your deployment platform
2. Ensure all API keys are properly configured
3. Test all functionality before going live
4. Monitor API usage and costs
