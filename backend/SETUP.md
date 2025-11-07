# Backend Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/setu-studios

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## Database Models

### User Model
- Stores user profile information
- Includes enhanced profile data from signup form
- Tracks user activity and preferences

### IdeaAnalysis Model
- Stores comprehensive idea analysis results
- Includes Gemini API analysis data
- Tracks user interactions (bookmarks, ratings, views)

## API Endpoints

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /idea-analysis` - Get user's idea analysis history
- `GET /stats` - Get user statistics
- `GET /search` - Search users

### Idea Analysis Routes (`/api/idea-analysis`)
- `POST /` - Create new idea analysis
- `PUT /:id/analysis` - Update analysis with Gemini results
- `GET /` - Get user's analyses
- `GET /:id` - Get specific analysis
- `PUT /:id/interaction` - Update analysis interaction
- `DELETE /:id` - Delete analysis
- `GET /public/search` - Search public analyses
- `GET /public/trending` - Get trending analyses

## Features

- **User Profile Management**: Complete user profile with enhanced data
- **Idea Analysis Storage**: Store and manage comprehensive idea analyses
- **User Interactions**: Track bookmarks, ratings, and views
- **Search & Discovery**: Search users and public analyses
- **Statistics**: Track user activity and analysis metrics
- **Authentication**: Secure API endpoints with user authentication
