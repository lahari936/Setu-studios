# Setu Studios - Backend Integration Setup

This document provides step-by-step instructions to integrate your frontend with Supabase database and Firebase authentication.

## Prerequisites

1. **Supabase Account**: You need a Supabase account and project
2. **Firebase Account**: You need a Firebase account and project
3. **Node.js**: Ensure you have Node.js installed

## Step 1: Supabase Setup

### 1.1 Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL**: `https://arotxlivhqesunkfabls.supabase.co`
   - **Anon Key**: Copy the `anon` public key

### 1.2 Update Supabase Configuration

1. Open `src/config/supabase.ts`
2. Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key:

```typescript
const supabaseKey = 'your-actual-anon-key-here';
```

### 1.3 Set Up Database Schema

**Recommended: Supabase Auth Setup**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema-supabase-auth.sql`
4. Click **Run** to create the tables and policies

**Alternative: Simple Setup (No RLS)**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema-simple.sql`
4. Click **Run** to create the tables

**Note:** The Supabase Auth setup provides better security with Row Level Security policies that work seamlessly with Supabase authentication.

## Step 2: Supabase Auth Setup

### 2.1 Enable Google Authentication in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable **Google** as a sign-in provider
5. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console
6. Add your domain to **Site URL**: `http://localhost:3000` (for development)

### 2.2 Configure Google OAuth (Optional)

If you want to use Google OAuth, you'll need to:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000` (for development)

## Step 3: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

## Step 4: Run the Application

```bash
npm run dev
```

## Features Implemented

### Authentication
- **Google Sign-In**: Users can sign in with their Google accounts
- **Protected Routes**: Profile page requires authentication
- **User Management**: Automatic user profile creation and updates

### Database Integration
- **User Profiles**: Store user information in Supabase
- **Cart Management**: Persistent cart storage in database
- **Real-time Sync**: Cart updates sync across sessions
- **Row Level Security**: Users can only access their own data

### Cart Functionality
- **Add to Cart**: Add services to cart with database persistence
- **Update Quantities**: Modify item quantities
- **Remove Items**: Delete items from cart
- **Clear Cart**: Empty entire cart
- **Checkout Process**: Complete order with user information

### User Profile
- **Edit Profile**: Users can update their information
- **Real-time Updates**: Changes sync with database
- **Protected Access**: Only authenticated users can access

## Database Schema

### Users Table
- `id`: Primary key (Firebase UID)
- `email`: User email
- `name`: User's full name
- `phone`: Phone number (optional)
- `company`: Company name (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Cart Items Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `name`: Service name
- `price`: Service price
- `quantity`: Item quantity
- `type`: Service type (individual/combo)
- `description`: Service description
- `timeline`: Delivery timeline
- `category`: Service category
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Firebase Authentication**: Secure Google OAuth integration
- **Input Validation**: Form validation and sanitization
- **Protected Routes**: Authentication guards for sensitive pages

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**: Verify your anon key is correct
2. **Firebase Auth Error**: Ensure Google sign-in is enabled
3. **Database Permission Error**: Check RLS policies are set up correctly
4. **CORS Issues**: Verify your domain is added to Firebase authorized domains

### Debug Steps

1. Check browser console for errors
2. Verify network requests in browser dev tools
3. Check Supabase logs in dashboard
4. Verify Firebase authentication status

## Next Steps

1. **Customize UI**: Modify the design to match your brand
2. **Add More Services**: Extend the cart with additional service types
3. **Payment Integration**: Add payment processing
4. **Email Notifications**: Send order confirmations
5. **Admin Dashboard**: Create admin interface for order management

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all credentials are correct
3. Ensure all dependencies are installed
4. Check that database schema is set up correctly
