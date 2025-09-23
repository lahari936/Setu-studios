# Deployment Guide for Setu Studios

## Environment Variables Setup

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

## Getting API Keys

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key

### 2. Gemini AI Setup
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy the API key

### 3. EmailJS Setup
1. Go to [EmailJS](https://www.emailjs.com)
2. Create an account and service
3. Create email templates for customer and admin notifications
4. Copy the Service ID, Template IDs, and Public Key

## Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the SPA

## Security Notes

- Never commit the `.env` file to version control
- Use environment variables for all sensitive data
- Ensure all API keys have proper permissions and restrictions
- Regularly rotate API keys

## Performance Optimization

- The build process optimizes assets automatically
- Images are optimized during build
- Code is minified and tree-shaken
- CSS is purged of unused styles

## Monitoring

- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor API usage and costs
- Set up uptime monitoring
- Track user analytics

## Database Setup

1. Run the SQL scripts in the root directory:
   - `database-schema.sql` - Main database schema
   - `database-schema-orders.sql` - Orders table
   - `database-schema-supabase-auth.sql` - Auth tables

2. Enable Row Level Security (RLS) policies in Supabase
3. Set up proper user permissions

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure your domain is whitelisted in Supabase
2. **API key errors**: Check environment variables are properly set
3. **Build failures**: Ensure all dependencies are installed
4. **Email not sending**: Verify EmailJS configuration

### Debug Mode
Set `VITE_DEBUG=true` in your environment variables to enable debug logging (development only).
