# Setu Studios Backend API

This is the backend API for the Setu Studios platform, providing mentor management, booking system, and email automation.

## Features

- **Mentor Management**: CRUD operations for mentors with verification system
- **Email Automation**: Automated notifications for mentor applications and bookings
- **Booking System**: Session scheduling with confirmation emails
- **Analytics**: Weekly booking reports and mentor performance tracking
- **Security**: Rate limiting, CORS, and input validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=studiossetu@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=studiossetu@gmail.com

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/setu-studios

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Email
ADMIN_EMAIL=studiossetu@gmail.com
```

### 3. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in the `EMAIL_PASS` variable

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod serves --dbpath /path/to/your/db
```

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Mentors
- `GET /api/mentors` - Get all mentors
- `POST /api/mentors` - Create new mentor application
- `GET /api/mentors/:id` - Get mentor by ID
- `PUT /api/mentors/:id` - Update mentor
- `DELETE /api/mentors/:id` - Delete mentor
- `GET /api/mentors/verify/:token` - Verify mentor (email link)
- `POST /api/mentors/:id/book` - Book mentorship session

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/feedback` - Add feedback
- `GET /api/bookings/analytics/weekly` - Get weekly analytics
- `POST /api/bookings/analytics/weekly-report` - Send weekly report

## Email Automation

The system automatically sends emails for:

1. **Mentor Applications**: Admin notification with accept button
2. **Booking Confirmations**: Mentor and admin notifications
3. **Weekly Reports**: Automated analytics summary

## Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Input validation
- Secure token-based verification
- Helmet.js security headers

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

The server will restart automatically when files change.
